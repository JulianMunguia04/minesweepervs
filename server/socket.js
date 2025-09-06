import { createServer } from 'http';
import { Server } from 'socket.io';
import pgClient from '../database/postgresdb.js';
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

    // Add this user to the matchmaking queue
    const player = {
      id: userData.username,
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
          status: "waiting",
          gameId: gameId,
        })
      );

      const game = await redis.get(`match:${gameId}`)

      console.log(`✅ Game ${gameId} created: ${p1.guestId || p1.username} vs ${p2.guestId || p2.username}`);

      // Send both players to the game
      io.to(p1.socketId).emit("game-found", gameId, p2, game);
      io.to(p2.socketId).emit("game-found", gameId, p1, game);
    }
  })

  socket.on('find-online-game-guest', async (guestData) => {
    console.log(`🎮 Guest ${guestData.username} is searching for a game with ELO ${guestData.elo}`);

    // Add this guest to the matchmaking queue
    const player = {
      id: guestData.username,
      username: guestData.username,
      elo: guestData.elo,
      socketId: socket.id,
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
          status: "waiting",
          gameId: gameId,
        })
      );

      const game = await redis.get(`match:${gameId}`)

      console.log(`✅ Game ${gameId} created: ${p1.username || p1.username} vs ${p2.username || p2.username}`);

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

      io.to(gameId).emit("game-started", game, socket.role);
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