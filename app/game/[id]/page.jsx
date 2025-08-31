"use client";

import React from 'react'
import { useState, useEffect } from 'react';
import Sidebar from "../../../components/sidebar"
import Board from "../../../components/board"
import { useParams } from "next/navigation";

const Game = () => {
  const params = useParams();
  const { id } = params;
  const [userData, setUserData] = useState(null);
  
    useEffect(() => {
      console.log("id: ", id)
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