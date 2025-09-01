"use client"

import React from 'react'
import { useState, useEffect } from 'react';
import Sidebar from "../../components/sidebar"
import Board from "../../components/board"
import PlayMenu from "../../components/playMenu"
import Ads from "../../components/adexample"
import socket from '../socket.js';
import useGuestUser from '../../components/guestUser.js'

const Play = () => {
  const [userData, setUserData] = useState(null);
  const [searching, setSearching] = useState(false)

  const guestUser = useGuestUser();
  
    useEffect(() => {
      const FRONTEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  
      fetch(`${FRONTEND_URL}/userdata`, {
        method: "GET",
        credentials: "include"
      })
      .then(res => res.json())
      .then((data) => {
        console.log("User data:", data);
        setUserData(data);
      })
      .catch((err) => {
        console.error("❌ Failed to fetch userdata", err);
      })
    }, []);
    
    useEffect(() => {
      socket.on('searching-for-online-game', () => {
        setSearching(true)
      });
  
      return () => {
        socket.off('searching-for-online-game');
      };
    }, []);

    const findOnlineGame = (userData) =>{
      if (userData){
        socket.emit("find-online-game", userData)
      }else{
        socket.emit("find-online-game-guest", guestUser)
      }
    }

    const leaveOnlineGameQueue = () =>{
      console.log("leave queue button")
      socket.emit("leave-queue")
    }

    useEffect(() => {
      socket.on("left-queue", () => {
        setSearching(false)
        console.log("left queeue")
      });
  
      return () => {
        socket.off("left-queue");
      };
    }, []);

  return(
    <>
      <Sidebar 
        userData={userData}
      />
      <main style={{marginLeft:'calc(13vw + 16px)', padding:'0.5rem', height: "100vh", width: "calc(100vw-(13vw + 16px))"}}>
        <div 
          className="d-flex align-items-center justify-content-center" 
          style={{ gap: "5%", height: "100vh", marginRight: "36vw"}}
        >
          <Board
            gameStarted = {true}
            gridData = {null}
          />
        </div>
      </main>
      <PlayMenu 
        userData={userData} 
        findOnlineGame={findOnlineGame} 
        searching={searching}
        leaveOnlineGameQueue={leaveOnlineGameQueue}
      />
      <Ads/>
    </>
  )
}

export default Play;