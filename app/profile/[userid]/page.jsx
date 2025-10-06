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
  const [gameHistoryPage, setGameHistoryPage] = useState(1)
 
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
          <div className='convex-minesweeper-no-hover' style={{padding:"2vw"}}>
            {profileData ? (
              <div>
                <div style={{display:"flex", alignItems:"center"}}>
                <img 
                  rel="preload"
                  src={profileData?.profile_picture? `${profileData?.profile_picture}` : "/My-Account.png"}
                  style={{
                    width: '5%',
                    borderRadius: '100%'
                  }}
                />
                <div style={{fontWeight:"bold", fontSize: "1.75vw", letterSpacing: "0.5px", marginLeft: "2%"}}>{profileData.username}</div>
              </div>
                <div>First Name: {profileData.first_name || "N/A"}</div>
                <div>Last Name: {profileData.last_name || "N/A"}</div>
                <div>Games Played: {profileData.games_played}</div>
                <div>Games Won: {profileData.games_won}</div>
                <div>ELO: {profileData.elo}</div>
                <div>Average Points Per Second: {profileData.avg_points_per_second}</div>
                <div>Account Created: {new Date(profileData.created_at).toLocaleDateString()}</div>
              </div>
            ):(
              <div>
                Loading...
              </div>
            )}
          </div>
          <div className='convex-minesweeper-no-hover' style={{padding:"2vw", marginTop: "2vh"}}>
            <div 
              style={{fontWeight:"bold", fontSize: "1.75vw", letterSpacing: "0.5px"}}
            >
              Game History
            </div>
            {!gameHistoryChecked ? (
              <div>...getting game history</div>
            ) : gameHistory && gameHistory.length > 0 ? (
              <div>
                {(() => {
                  const gamesPerPage = 5;
                  const startIndex = (gameHistoryPage - 1) * gamesPerPage;
                  const endIndex = startIndex + gamesPerPage;
                  const currentGames = gameHistory.slice(startIndex, endIndex);

                  return (
                    <>
                      {currentGames.map((game, index) => (
                        <div
                          key={index}
                          className="concave-minesweeper-no-hover"
                          style={{
                            marginTop: "1vh",
                            height: "3vh",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "0 1vw",
                            cursor: "pointer",
                          }}
                        >
                          <div>Game ID: {game.gameid}</div>
                          <div>Date: {new Date(game.created_at).toLocaleDateString()}</div>
                        </div>
                      ))}

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          marginTop: "2vh",
                          gap: "0.5vw",
                        }}
                      >
                        {Array.from({
                          length: Math.ceil(gameHistory.length / gamesPerPage),
                        }).map((_, pageIndex) => (
                          <div
                            key={pageIndex}
                            onClick={() => setGameHistoryPage(pageIndex + 1)}
                            className="concave-minesweeper-no-hover"
                            style={{
                              padding: "0.5vw 1vw",
                              cursor: "pointer",
                              backgroundColor:
                                gameHistoryPage === pageIndex + 1 ? "lightblue" : "transparent",
                              border: "1px solid gray",
                              borderRadius: "6px",
                              fontWeight:
                                gameHistoryPage === pageIndex + 1 ? "bold" : "normal",
                            }}
                          >
                            {pageIndex + 1}
                          </div>
                        ))}
                      </div>
                    </>
                  );
                })()}
              </div>
            ) : (
              <div>No games found.</div>
            )}
          </div>
        </main>
    </>
  )
}

export default Profile
