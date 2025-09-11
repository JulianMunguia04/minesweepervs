"use client";

import React from 'react'
import { useState, useEffect, useCallback, useRef } from 'react';
import Sidebar from "../../../components/sidebar"
import Board from "../../../components/board"
import { useParams } from "next/navigation";
import socket from '../../socket';
import OpponentBoard from "../../../components/opponentBoard"

const Game = () => {
  const params = useParams();
  const { gameid } = params;
  const [userData, setUserData] = useState(null);
  const [guestData, setGuestData] = useState(null);
  const [playerNumber, setPlayerNumber] = useState(null);
  const [gameStarted, setGameStarted] = useState(false)

  const [gridData, setGridData] = useState(null);
  const [opponentGridData, setOpponentGridData] = useState(null);

  const [elo, setElo] = useState(1000)
  const [opponentElo, setOpponentElo] = useState(1000)

  const [profilePicture, setProfilePicture] = useState(null)
  const [opponentProfilePicture, setOpponentProfilePicture] = useState(null);

  const [points, setPoints] = useState(0);
  const [opponentPoints, setOpponentPoints]= useState(0);

  const [frozen, setFrozen] = useState(false)
  const [opponentFrozen, setOpponentFrozen] = useState(false)

  const [shield, setShield] = useState(false);
  const [opponentShield, setOpponentShield] = useState(false);

  const shieldRef = useRef(shield);

  const [smokescreen, setSmokescreen] = useState(false)
  const [opponentSmokescreen, setOpponentSmokescreen] = useState(false);

  const smokescreenRef = useRef(smokescreen)

  const [clicker, setClicker] = useState(false)
  const [opponentClicker, setOpponentClicker] = useState(false);

  const clickerRef = useRef(clicker)
  const lastUpdateFromClickerRef = useRef(false);

  useEffect(() => {
    shieldRef.current = shield;
  }, [shield]);
  
  useEffect(() => {
    const storedGuest = localStorage.getItem("guest_data");
    setGuestData(storedGuest ? JSON.parse(storedGuest) : null);
    const FRONTEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

    fetch(`${FRONTEND_URL}/userdata`, {
      method: "GET",
      credentials: "include"
    })
    .then(res => res.json())
    .then((data) => {
      console.log("User data:", data);
      setUserData(data);
    });
  }, []);

  useEffect(() => {
    if (gameid && (userData || guestData)) {
      const player = userData || guestData;
      socket.emit("join-game", player, gameid);
    }
  }, [userData, guestData, gameid]);

  useEffect(() => {
    socket.on("role", (player) => {
      setPlayerNumber(player)
      console.log("player role: ", player)
    });

    return () => {
      socket.off("role");
    };
  }, []);

  useEffect(() => {
    socket.on("game-started", (game, role)=>{
      if (role === "player1"){
        setElo(game.player1.elo)
        console.log("Elo: ", game.player1.elo)
        setOpponentElo(game.player2.elo)
        console.log("opponent elo", game.player2.elo)
        setProfilePicture(game.player1.profilePicture)
        setOpponentProfilePicture(game.player2.profilePicture)

        //Set Grid (empty if no grid yet
        setGridData(game.player1_board)
        setOpponentGridData(game.player2_board)

        //Start Game
        setGameStarted(true)
        console.log(gameStarted)
      }else if (role === "player2"){
        setElo(game.player2.elo)
        console.log("Elo: ", game.player2.elo)
        setOpponentElo(game.player1.elo)
        console.log("opponent elo", game.player1.elo)
        setProfilePicture(game.player2.profilePicture)
        setOpponentProfilePicture(game.player1.profilePicture)

        //Set Grid (empty if no grid yet
        setGridData(game.player1_board)
        setOpponentGridData(game.player2_board)

        setGameStarted(true)
        console.log(gameStarted)
      }
    })

    return () => {
      socket.off("game-started");
    };
  }, []);

  //Communcation to other player
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  const sendUpdatedBoard = useCallback(
    debounce((grid, points) => {
      socket.emit("update-board", grid, points, gameid, playerNumber);
    }, 10),
    [gameid, playerNumber]
  );

  const sendOpponentUpdatedBoard = useCallback(
    debounce((grid, points) => {
      socket.emit("opponent-update-board", grid, points, gameid, playerNumber);
    }, 10),
    [gameid, playerNumber]
  ); 

  //Receiving opponet cha
  useEffect(() => {
    socket.on("opponent-board-updated", (grid, points)=>{
      console.log("Updated board", grid, points)
      setOpponentPoints(points)
      setOpponentGridData(grid)
    })

    return () => {
      socket.off("opponent-board-updated");
    };
  }, []);

  useEffect(() => {
    socket.on("board-updated", (grid, points) => {
      console.log("update from opponent clicker");
      lastUpdateFromClickerRef.current = true;
      setPoints(points);
      setGridData(grid);
    });

    return () => {
      socket.off("board-updated");
    };
  }, []);

  const freezeOpponent = () => {
    const freezeTime = 5000
    socket.emit("freeze-opponent", gameid, freezeTime)
    if (!opponentShield){
      setOpponentFrozen(true)
      setTimeout(()=>{
        setOpponentFrozen(false)
      }, freezeTime)
    }
    
  }

  useEffect(() => {
    socket.on("freeze", (freezeTime)=>{
      console.log("frozen received")
      if (!shieldRef.current) {
        console.log("shield", shield)
        setFrozen(true)
        setTimeout(()=>{
          setFrozen(false)
        }, freezeTime)
      }
    })

    return () => {
      socket.off("freeze");
    };
  }, []);

  const smokescreenOpponent = () => {
    const smokescreenTime = 5000
    socket.emit("smokescreen-opponent", gameid, smokescreenTime)
    if (!opponentShield){
      setOpponentSmokescreen(true)
      setTimeout(()=>{
        setOpponentSmokescreen(false)
      }, smokescreenTime)
    }
  }

  useEffect(() => {
    socket.on("smokescreen", (smokescreenTime)=>{
      console.log("smokescreen received")
      if (!smokescreenRef.current) {
        console.log("smokescreen", smokescreen)
        setSmokescreen(true)
        setTimeout(()=>{
          setSmokescreen(false)
        }, smokescreenTime)
      }
    })

    return () => {
      socket.off("smokescreen");
    };
  }, []);

  const activateShield = ()=>{
    const shieldTime = 5000
    socket.emit("shield", gameid, shieldTime)
  }

  const activateClicker = ()=>{
    const clickerTime = 2000
    socket.emit("clicker", gameid, clickerTime)
  }

  useEffect(() => {
    socket.on("self-shield", (shieldTime) => {
      console.log("✅ Shield activated on my side");
      setShield(true);
      setTimeout(() => {
        setShield(false);
      }, shieldTime);
    });

    return () => {
      socket.off("self-shield");
    };
  }, []);

  useEffect(() => {
    socket.on("opponent-shield", (shieldTime)=>{
      console.log("frozen receivedd")
      setOpponentShield(true)
      setTimeout(()=>{
        setOpponentShield(false)
      }, shieldTime)
    })

    return () => {
      socket.off("opponent-shield");
    };
  }, []);

  useEffect(() => {
    socket.on("self-clicker", (clickerTime) => {
      console.log("✅ Clicker activated on my side");
      setClicker(true);
      setTimeout(() => {
        setClicker(false);
      }, clickerTime);
    });

    return () => {
      socket.off("self-clicker");
    };
  }, []);

  useEffect(() => {
    socket.on("opponent-clicker", (clickerTime)=>{
      console.log("clicker receivedd")
      setOpponentClicker(true)
      setTimeout(()=>{
        setOpponentClicker(false)
      }, clickerTime)
    })

    return () => {
      socket.off("opponent-clicker");
    };
  }, []);

  return(
    <>
      <Sidebar 
        userData={userData}
      />
      <main style={{marginLeft:'calc(13vw + 16px)', padding:'0.5rem'}}>
        <div className="d-flex" style={{ gap: "5%" }}>
          <Board
            gameStarted = {gameStarted}
            gridData = {gridData}
            sendUpdatedBoard = {sendUpdatedBoard}
            points={points}
            setPoints={setPoints}
            frozen={frozen}
            freezeOpponent={freezeOpponent}
            shield={shield}
            activateShield={activateShield}
            smokescreenOpponent={smokescreenOpponent}
            smokescreen={smokescreen}
            clicker={clicker}
            activateClicker={activateClicker}
            lastUpdateFromClickerRef={lastUpdateFromClickerRef}
          />
          <OpponentBoard
            gameStarted = {clicker}
            gridData = {opponentGridData}
            sendUpdatedBoard = {sendOpponentUpdatedBoard}
            points={opponentPoints}
            setPoints={setOpponentPoints}
            frozen={opponentFrozen}
            shield={opponentShield}
            smokescreen={opponentSmokescreen}
            clicker={opponentClicker}
          />
        </div>
      </main>

    </>
  )
}

export default Game;