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
  
  useEffect(() => {
    setGuestData(localStorage.getItem("guest_data"));
    console.log("gameid: ", gameid)
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
  });

  useEffect(() => {
    if (!userData){
      let guestData = localStorage.getItem("guest_data");
      if (!guestData){
        console.log("Player not found")
      }
      socket.emit("join-game", guestData, gameid)
    }
  })

  return(
    <>
      <Sidebar 
        userData={userData}
      />
      <main style={{marginLeft:'calc(13vw + 16px)', padding:'0.5rem'}}>
        <div className="d-flex" style={{ gap: "5%" }}>
          <Board
            gameStarted = {true}
            gridData = {null}
          />
          <Board
            gameStarted = {true}
            gridData = {null}
          />
        </div>
      </main>

    </>
  )
}

export default Game;