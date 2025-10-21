"use client"

import React from 'react'
import { useState, useEffect, useRef } from 'react';
import Sidebar from "../../components/sidebar"
import Board from "../../components/singlePlayerBoard"
import PlayMenu from "../../components/playMenu"
import Ads from "../../components/adexample"
import socket from '../socket.js';
import useGuestUser from '../../components/guestUser.js'
import { useRouter } from 'next/navigation';

const Play = () => {
  const [userData, setUserData] = useState(null);
  const [searching, setSearching] = useState(false)
  const [friends, setFriends] = useState([])

  const router = useRouter();

  const guestUser = useGuestUser();

  const [incomingInvite, setIncomingInvite] = useState(null);

  const FRONTEND_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  
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

  useEffect(()=>{
    if (!userData) return
    if (!socket.connected) return
    socket.emit("register-user", userData)
  }, [userData])

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        // 1️⃣ Get the friend IDs
        const res = await fetch(`${FRONTEND_URL}/api/friends`, {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch friend IDs");
        const data = await res.json();
        const friendIds = data.friends;

        // 2️⃣ Fetch all friend info in parallel
        const friendsData = await Promise.all(
          friendIds.map(async (id) => {
            try {
              const res = await fetch(`${FRONTEND_URL}/api/user/${id}`);
              if (!res.ok) throw new Error(`Failed to fetch user ${id}`);
              return await res.json();
            } catch (err) {
              console.error(err);
              return null;
            }
          })
        );
        setFriends(friendsData.filter(Boolean));
      } catch (err) {
        console.error("❌ Error fetching friends:", err);
      }
    };

    fetchFriends();
  }, [userData]);

  useEffect(()=>{
    console.log(friends)
  }, [friends])
  
  useEffect(() => {
    socket.on('searching-for-online-game', () => {
      setSearching(true)
    });

    return () => {
      socket.off('searching-for-online-game');
    };
  }, []);

  useEffect(() => {
    socket.on("game-invite", (invite) => {
      setIncomingInvite(invite);
    });

    return () => {
      socket.off("game-invite");
    };
  }, []);

  const findOnlineGame = (userData) =>{
    if (userData){
      socket.emit("find-online-game", userData)
      console.log("searching")
    }else{
      socket.emit("find-online-game-guest", guestUser)
      console.log("searching")
    }
  }

  const inviteFriend = (friendId) =>{
    if (!userData) return console.warn("UserData not loaded yet");
    if (userData && friendId){
      socket.emit("invite-friend", userData, friendId)
    }
    console.log("INvite button clicked")
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

  useEffect(() => {
    socket.on("game-found", (gameId, opponent, game) => {
      console.log(`/game/${gameId}`)
      console.log(gameId)
      console.log("game: ", game)
      router.push(`/game/${gameId}`);
    });

    return () => {
      socket.off("game-found");
    };
  }, []);

  const toggleAllMenusOff =() => {
    setShowPlayMenu(false);
  }

  //Play a friend menu toggle
  const [showPlayMenu, setShowPlayMenu] = useState(true);
  const playTimeoutRef = useRef(null);
  const playMenuOn = () => {
    toggleAllMenusOff()
    if (playTimeoutRef.current) {
      clearTimeout(playTimeoutRef.current);
    }
    setShowPlayMenu(true)
  };
  const playMenuTimedOff = () => playTimeoutRef.current = setTimeout(()=>{
    setShowPlayMenu(false)
  }, 500);
  const playMenuOff = () => setShowPlayMenu(false);

  return(
    <>
      <Sidebar 
        userData={userData}
        socket = {socket}
      />
      <main style={{display: "relative", marginLeft:'calc(13vw + 16px)', padding:'0.5rem', height: "100vh", width: "calc(100vw-(13vw + 16px))"}}>
        <div 
          className="d-flex align-items-center justify-content-center" 
          style={{ gap: "5%", height: "100vh", marginRight: "36vw"}}
        >
          <Board
            gameStarted = {true}
            gridData = {null}
            sendUpdatedBoard = {console.log}
          />
        </div>
        <div style={{position:"absolute", top: "2vh", right: "2vh", width: "10vh"}}>
          {incomingInvite && (
          <div className="invite-modal">
              <p>{incomingInvite.message}</p>
              <button onClick={() => {
                socket.emit("accept-invite", incomingInvite.from.id);
                setIncomingInvite(null);
              }}>Accept</button>
              <button onClick={() => {
                socket.emit("decline-invite", incomingInvite.from.id);
                setIncomingInvite(null);
              }}>Decline</button>
            </div>
          )}
        </div>
      </main>
      <PlayMenu 
        userData={userData} 
        findOnlineGame={findOnlineGame} 
        searching={searching}
        leaveOnlineGameQueue={leaveOnlineGameQueue}
        showPlayMenu={showPlayMenu}
        playMenuOff={playMenuOff}
        playMenuOn = {playMenuOn}
        playMenuTimedOff = {playMenuTimedOff}
        friends = {friends}
        inviteFriend= {inviteFriend}
      />
      <Ads/>
    </>
  )
}

export default Play;