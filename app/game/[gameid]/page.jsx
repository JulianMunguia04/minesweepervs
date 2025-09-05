"use client";

import React from 'react'
import { useState, useEffect } from 'react';
import Sidebar from "../../../components/sidebar"
import Board from "../../../components/board"
import { useParams } from "next/navigation";
import socket from '../../socket';

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
  const [opponentProfilePicture, setOpponentProfilePicture] = useState(null)
  
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
          />
          <Board
            gameStarted = {gameStarted}
            gridData = {opponentGridData}
          />
        </div>
      </main>

    </>
  )
}

export default Game;