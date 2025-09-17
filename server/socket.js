import { createServer } from 'http';
import { Server } from 'socket.io';
import {createGameSQL, gameEndedSQL} from '../database/postgresdb.js';
import redis from '../database/redis.js'
import { v4 as uuidv4 } from "uuid";

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', async (socket) => {
  console.log('✅ New socket connected:', socket.id);

  socket.on('message', (data) => {
    console.log('💬 Message received:', data);
    socket.emit('message', data);
  });

  socket.on('find-online-game', async (userData) =>{
    console.log(`🎮 ${userData.username} is searching for a game`);
    console.log(`user data searching for game: `, userData)

    // Add this user to the matchmaking queue
    const player = {
      id: userData.id,
      username: userData.username,
      elo: userData.elo,
      socketId: socket.id,
      profilePicture: userData.profile_picture
    };
    await redis.rPush("matchmaking_queue", JSON.stringify(player));

    // Tell this client we’re searching
    socket.emit("searching-for-online-game");

    // Fetch all waiting players
    const queue = await redis.lRange("matchmaking_queue", 0, -1);

    const queueLength = queue.length;

    if (queueLength >= 2) {
      // Pop two players
      const p1 = JSON.parse(await redis.lPop("matchmaking_queue"));
      const p2 = JSON.parse(await redis.lPop("matchmaking_queue"));

      // Create a new game
      const gameId = uuidv4();
      await redis.set(
        `match:${gameId}`,
        JSON.stringify({
          player1: p1,
          player2: p2, 
          player1_board: null, 
          player2_board: null, 
          player1_points: 0,
          player2_points: 0,
          time_left: 300, 
          player1_state: "waiting",
          player2_state: "waiting",
          player1_shield: false,
          player2_shield: false,
          player1_clicker: false,
          player2_clicker: false,
          status: "waiting",
          gameId: gameId,
          player1_finished: false,
          player2_finished: false,
          game_finished: false
        })
      );

      const game = await redis.get(`match:${gameId}`)

      console.log(`✅ Game ${gameId} created: ${p1.guestId || p1.username} vs ${p2.guestId || p2.username}`);

      //save game to PostgreSQL
      await createGameSQL(game)


      // Send both players to the game
      io.to(p1.socketId).emit("game-found", gameId, p2, game);
      io.to(p2.socketId).emit("game-found", gameId, p1, game);
    }
  })

  socket.on('find-online-game-guest', async (guestData) => {
    console.log(`🎮 Guest ${guestData.username} is searching for a game with ELO ${guestData.elo}`);
    console.log(`guest data seacrhing`, guestData)

    // Add this guest to the matchmaking queue
    const player = {
      id: guestData.id,
      username: guestData.username,
      elo: guestData.elo,
      socketId: socket.id,
      profilePicture: guestData.profile_picture
    };
    await redis.rPush("matchmaking_queue", JSON.stringify(player));

    // Tell this client we’re searching
    socket.emit("searching-for-online-game");

    // Fetch all waiting players
    const queue = await redis.lRange("matchmaking_queue", 0, -1);

    if (queue.length >= 2) {
      // Pop two players from the queue
      const p1 = JSON.parse(await redis.lPop("matchmaking_queue"));
      const p2 = JSON.parse(await redis.lPop("matchmaking_queue"));

      // Create a new game
      const gameId = uuidv4();
      await redis.set(
        `match:${gameId}`,
        JSON.stringify({
          player1: p1,
          player2: p2,
          player1_board: null, 
          player2_board: null, 
          player1_points: 0,
          player2_points: 0,
          time_left: 300, 
          player1_state: "waiting",
          player2_state: "waiting",
          player1_shield: false,
          player2_shield: false,
          player1_clicker: false,
          player2_clicker: false,
          status: "waiting",
          gameId: gameId,
          player1_finished: false,
          player2_finished: false,
          game_finished: false
        })
      );

      const game = await redis.get(`match:${gameId}`)

      console.log(`✅ Game ${gameId} created: ${p1.username || p1.username} vs ${p2.username || p2.username}`);

      //save game to PostgreSQL
      await createGameSQL(game)

      // Send both players to the game
      io.to(p1.socketId).emit("game-found", gameId, p2, game);
      io.to(p2.socketId).emit("game-found", gameId, p1, game);
    }
  });

  socket.on("leave-queue", async () => {
    console.log(`❌ Socket ${socket.id} wants to leave the queue`);

    const queue = await redis.lRange("matchmaking_queue", 0, -1);

    for (let i = 0; i < queue.length; i++) {
      const player = JSON.parse(queue[i]);
      if (player.socketId === socket.id) {
        // Remove the player from the queue
        await redis.lRem("matchmaking_queue", 1, queue[i]);
        console.log(`✅ Removed ${player.username || player.guestId} from the queue`);
        socket.emit("left-queue")
        break;
      }
    }
  });

  //Game Joining
  socket.on('join-game', async (playerData, gameId) => {
    const gameLengthSeconds = 120
    let game = JSON.parse(await redis.get(`match:${gameId}`));
    console.log(game)
    if (!game) return socket.emit("error", "Game not found");

    if (game.player1.username === playerData.username) {
      console.log("player one connected")
      game.player1_state = "ready";
      game.player1.socketId = socket.id;
      socket.role = "player1"
      socket.join(gameId);
      socket.emit("role", "player1")
    } else if (game.player2.username === playerData.username) {
      console.log("player one connected")
      game.player2_state = "ready";
      game.player2.socketId = socket.id;
      socket.role = "player2"
      socket.join(gameId);
      socket.emit("role", "player2")
    } else {
      return socket.emit("error", "You are not part of this game");
    }

    // Save updated game
    await redis.set(`match:${gameId}`, JSON.stringify(game));

    // If both players are ready, start the game
    if (game.player1_state === "ready" && game.player2_state === "ready") {
      game.status = "started";
      console.log("both ready")
      await redis.set(`match:${gameId}`, JSON.stringify(game));

      io.to(game.player1.socketId).emit("game-started", game, "player1", gameLengthSeconds);
      io.to(game.player2.socketId).emit("game-started", game, "player2", gameLengthSeconds);
      
    }
  });

  //Playing Game
  socket.on("update-board", async (grid, points, gameId, playerNumber) =>{
    let game = JSON.parse(await redis.get(`match:${gameId}`));
    if (game){
      if (playerNumber === "player1"){
        game.player1_points = points;
        game.player1_board = grid;
        socket.broadcast.to(gameId).emit("opponent-board-updated", grid, points );
      }else if (playerNumber === "player2"){
        game.player2_points = points;
        game.player2_board = grid;
        socket.broadcast.to(gameId).emit("opponent-board-updated", grid, points );
      }
    }
    await redis.set(`match:${gameId}`, JSON.stringify(game));
  });

  socket.on("opponent-update-board", async (grid, points, gameId, playerNumber) =>{
    let game = JSON.parse(await redis.get(`match:${gameId}`));
    if (game){
      if (playerNumber === "player1"){
        game.player2_points = points;
        game.player2_board = grid;
        socket.broadcast.to(gameId).emit("board-updated", grid, points );
      }else if (playerNumber === "player2"){
        game.player1_points = points;
        game.player2_board = grid;
        socket.broadcast.to(gameId).emit("board-updated", grid, points );
      }
    }
    await redis.set(`match:${gameId}`, JSON.stringify(game));
  });

  socket.on("freeze-opponent", async (gameId, freezeTime)=>{
    let game = JSON.parse(await redis.get(`match:${gameId}`));
    if (socket.role === "player1"){
      game.player2_state = "frozen"
      await redis.set(`match:${gameId}`, JSON.stringify(game));
      socket.broadcast.to(gameId).emit("freeze", freezeTime)
      setTimeout(async ()=>{
        let game = JSON.parse(await redis.get(`match:${gameId}`));
        game.player2_state = "playing"
        await redis.set(`match:${gameId}`, JSON.stringify(game));
      }, freezeTime)
    }else if (socket.role === "player2"){
      game.player1_state = "frozen"
      await redis.set(`match:${gameId}`, JSON.stringify(game));
      socket.broadcast.to(gameId).emit("freeze", freezeTime)
      setTimeout(async ()=>{
        JSON.parse(await redis.get(`match:${gameId}`));
        game.player1_state = "playing"
        await redis.set(`match:${gameId}`, JSON.stringify(game));
      }, freezeTime)
    }
  })

  socket.on("smokescreen-opponent", async (gameId, smokescreenTime)=>{
    let game = JSON.parse(await redis.get(`match:${gameId}`));
    if (socket.role === "player1"){
      game.player2_state = "smokescreen"
      await redis.set(`match:${gameId}`, JSON.stringify(game));
      socket.broadcast.to(gameId).emit("smokescreen", smokescreenTime)
      setTimeout(async ()=>{
        let game = JSON.parse(await redis.get(`match:${gameId}`));
        game.player2_state = "playing"
        await redis.set(`match:${gameId}`, JSON.stringify(game));
      }, smokescreenTime)
    }else if (socket.role === "player2"){
      game.player1_state = "smokescreen"
      await redis.set(`match:${gameId}`, JSON.stringify(game));
      socket.broadcast.to(gameId).emit("smokescreen", smokescreenTime)
      setTimeout(async ()=>{
        JSON.parse(await redis.get(`match:${gameId}`));
        game.player1_state = "playing"
        await redis.set(`match:${gameId}`, JSON.stringify(game));
      }, smokescreenTime)
    }
  })

  socket.on("shield", async (gameid, shieldTime)=>{
    let game = JSON.parse(await redis.get(`match:${gameid}`));
    if (socket.role === "player1"){
      game.player1_shield = true
      socket.emit("self-shield", shieldTime);
      socket.broadcast.to(gameid).emit("opponent-shield", shieldTime)
      await redis.set(`match:${gameid}`, JSON.stringify(game));

      setTimeout(async ()=>{
        JSON.parse(await redis.get(`match:${gameid}`));
        game.player1_shield = false
        await redis.set(`match:${gameid}`, JSON.stringify(game));
      }, shieldTime)
    }else if (socket.role === "player2"){
      game.player2_shield = true
      socket.emit("self-shield", shieldTime);
      socket.broadcast.to(gameid).emit("opponent-shield", shieldTime)
      await redis.set(`match:${gameid}`, JSON.stringify(game));

      setTimeout(async ()=>{
        JSON.parse(await redis.get(`match:${gameid}`));
        game.player2_shield = false
        await redis.set(`match:${gameid}`, JSON.stringify(game));
      }, shieldTime)
    }
  })

  socket.on("clicker", async (gameid, clickerTime)=>{
    let game = JSON.parse(await redis.get(`match:${gameid}`));
    if (socket.role === "player1"){
      game.player1_clicker = true
      socket.emit("self-clicker", clickerTime);
      socket.broadcast.to(gameid).emit("opponent-clicker", clickerTime)
      await redis.set(`match:${gameid}`, JSON.stringify(game));

      setTimeout(async () => {
        const game = JSON.parse(await redis.get(`match:${gameid}`));
        game.player1_clicker = false;
        await redis.set(`match:${gameid}`, JSON.stringify(game));
      }, clickerTime);
    }else if (socket.role === "player2"){
      game.player2_clicker = true
      socket.emit("self-clicker", clickerTime);
      socket.broadcast.to(gameid).emit("opponent-clicker", clickerTime)
      await redis.set(`match:${gameid}`, JSON.stringify(game));

      setTimeout(async () => {
        const game = JSON.parse(await redis.get(`match:${gameid}`));
        game.player2_clicker = false;
        await redis.set(`match:${gameid}`, JSON.stringify(game));
      }, clickerTime);
    }
  })

  socket.on("end-game", async (points, gameId, playerNumber) => {
    let game = JSON.parse(await redis.get(`match:${gameId}`));
    if (!game) return socket.emit("error", "Game not found");

    // Prevent double-finalization
    if (game.game_finished) return;  

    if (playerNumber === "player1") {
      game.player1_points = points;
      game.player1_finished = true;
    } else if (playerNumber === "player2") {
      game.player2_points = points;
      game.player2_finished = true;
    }

    await redis.set(`match:${gameId}`, JSON.stringify(game));

    // Check if both are done
    if (game.player1_finished && game.player2_finished && !game.game_finished) {
      game.game_finished = true; // lock it immediately

      // Determine winner
      let winner = null;
      if (game.player1_points > game.player2_points) winner = "player1";
      else if (game.player2_points > game.player1_points) winner = "player2";
      else winner = "draw";

      await redis.set(`match:${gameId}`, JSON.stringify(game));

      game = JSON.parse(await redis.get(`match:${gameId}`))

      //Update SQL after game
      const result = await gameEndedSQL(gameId, JSON.stringify(game))
      console.log("result ", result)

      io.to(gameId).emit("game-ended", 
        gameId,
        {
          username: game.player1.username,
          points: game.player1_points,
          board: game.player1_board,
          startingElo: result.player1_starting_elo,
          endingElo: result.player1_ending_elo
        },
        {
          username: game.player2.username,
          points: game.player2_points,
          board: game.player2_board,
          startingElo: result.player2_starting_elo,
          endingElo: result.player2_ending_elo
        },
        result,
        winner
      );

      await redis.del(`match:${gameId}`);

      console.log(`🏁 Game ${gameId} finished! Winner: ${winner}`);
    }
  });

  socket.on('disconnect', async () => {
    console.log('❌ Socket disconnected:', socket.id);

    //Leave Matchmaking Queue
    const queue = await redis.lRange("matchmaking_queue", 0, -1);
      for (let i = 0; i < queue.length; i++) {
        const player = JSON.parse(queue[i]);
        if (player.socketId === socket.id) {
          await redis.lRem("matchmaking_queue", 1, queue[i]);
          console.log(`✅ Removed ${player.username || player.guestId} from queue due to disconnect`);
          break;
        }
      }
    });
});

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`🚀 Socket.IO server running on port ${PORT}`);
});