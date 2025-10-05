"use client"

import React from 'react'
import { useState, useEffect } from 'react';
import { useParams, useRouter } from "next/navigation";

import Sidebar from "../../../components/sidebar"

const Profile = () => {
  const router = useRouter();
  const params = useParams();
  const { userid } = params;

  const [userData, setUserData] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [gameHistory, setGameHistory] = useState(null);
  const [gameHistoryChecked, setGameHistoryChecked] = useState(false);
 
  const FRONTEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  
  useEffect(() => {

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
    if (!userid) return;

    fetch(`${FRONTEND_URL}/api/user/${userid}`, {
      method: "GET",
    })
      .then(res => res.json())
      .then(data => {
        console.log("Fetched profile data:", data);
        setProfileData(data);
      })
      .catch(err => {
        console.error("❌ Failed to fetch user profile", err);
        //setLoading(false);
      });
  }, [userid]);

  useEffect(() => {
    if (!userid) return;

    fetch(`${FRONTEND_URL}/api/gamehistory/${userid}`, {
      method: "GET",
    })
      .then(res => res.json())
      .then(data => {
        console.log("Fetched game history data:", data);
        setGameHistory(data);
        setGameHistoryChecked(true);
      })
      .catch(err => {
        console.error("❌ Failed to fetch game history data", err);
      });
  }, [userid]);

  return(
    <>
        <Sidebar 
            userData={userData}
        />
        <main style={{marginLeft:'calc(13vw + 16px)', padding:'4%'}}>
          <div className='convex-minesweeper-no-hover' style={{padding:"3vw"}}>
            <div style={{display:"flex", alignItems:"center"}}>
              <img 
                rel="preload"
                src={profileData?.profile_picture? `${profileData?.profile_picture}` : "/My-Account.png"}
                style={{
                  width: '8%',
                  borderRadius: '100%'
                }}
              />
              <div style={{fontWeight:"bold", fontSize: "1.75vw", letterSpacing: "0.5px"}}>Profile</div>
            </div>
            <div>
              Profile Info:
            </div>
            {profileData ? (
              <div>
                <div>Username: {profileData.username}</div>
                <div>First Name: {profileData.first_name || "N/A"}</div>
                <div>Last Name: {profileData.last_name || "N/A"}</div>
                <div>Profile Picture: {profileData.profile_picture ? <img src={profileData.profile_picture} alt="Profile" style={{width: '100px', height: '100px'}} /> : "No picture"}</div>
                <div>Games Played: {profileData.games_played}</div>
                <div>Games Won: {profileData.games_won}</div>
                <div>ELO: {profileData.elo}</div>
                <div>Average Points Per Second: {profileData.avg_points_per_second}</div>
                <div>Account Created: {new Date(profileData.created_at).toLocaleDateString()}</div>
                {!gameHistoryChecked ? (
                  <div>...getting game history</div>
                ) : gameHistory && gameHistory.length > 0 ? (
                  <div>
                    {gameHistory.map((game, index) => (
                      <div key={index}>
                        <div>Game: {game.gameid}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div>No games found.</div>
                )}
              </div>
            ):(
              <div>
                Loading...
              </div>
            )}
          </div>
        </main>
    </>
  )
}

export default Profile
