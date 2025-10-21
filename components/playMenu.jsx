"use client"

import React from 'react'
import { useState, useEffect } from 'react';

const PlayMenu = ({
  userData, 
  findOnlineGame, 
  searching, 
  leaveOnlineGameQueue, 
  showPlayMenu, 
  playMenuOff, 
  playMenuOn, 
  playMenuTimedOff,
  friends,
  inviteFriend
}) => {
  return(
    <>
      <div
        className="position-fixed"
        style={{ 
          width: '26vw', 
          backgroundColor:' #bdbdbd', 
          borderTop: '4px solid #ffffff',
          borderLeft: '4px solid #ffffff',
          borderBottom: '4px solid #7c7c7c',
          borderRight: '4px solid #7c7c7c',  
          display:'flex',
          flexDirection:'column',
          //justifyContent:'space-between',
          alignItems:'center',
          padding: '10px',
          top: '5vh',
          right: '20vh',
          bottom: '10vh',
          gap:"2.5%"
        }}
      >
        {!searching ? (
          <>
            <div
              style={{
                width: "100%",
                height:'auto',
                margin:'0px',
                marginBottom:'0.5rem',
                display:"flex",
                alignItems:"center",
                justifyContent:"center",
                paddingBottom: "2%",
                borderBottom: "5px solid #7c7c7c"
              }}
            >
              <img src="/play-icon.png"></img>
              <div className="ml-4" style={{fontSize: "150%", fontWeight:"bold"}}>Play MinesweeperVs</div>
            </div>

            <div
              style={{ position: 'relative', width: '100%' }}
            >
              <div
                className="convex-minesweeper"
                style={{
                  width: '100%',
                  height:"10vh",
                  margin: 0,
                  marginBottom: '0.5rem',
                  cursor:'pointer',
                  display:'flex',
                  alignItems:'center',
                  padding:'1.5%'
                }}
                onClick={() => findOnlineGame(userData)}
              >
                <img 
                  src="/play-online.png"
                  style={{
                    width: '15%',
                    marginLeft: "2%"
                  }}
                ></img>
                <div className="d-flex flex-column justify-content-center w-full">
                  <div
                    style={{
                      marginLeft:'5%',
                      fontWeight:'bold',
                      fontSize:'130%'
                    }}
                  >
                    Play Online
                  </div>
                  <div
                    style={{
                      marginLeft:'5%',
                    }}
                  >
                    Play vs a person of similar skill
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{ position: 'relative', width: '100%' }}
            >
              <div
                className="convex-minesweeper"
                style={{
                  width: '100%',
                  height:"10vh",
                  margin: 0,
                  marginBottom: '0.5rem',
                  cursor:'pointer',
                  display:'flex',
                  alignItems:'center',
                  padding:'1.5%'
                }}
                onMouseEnter={playMenuOn}
                onMouseLeave={playMenuTimedOff}
              >
                <img 
                  src="/play-a-friend.png"
                  style={{
                    width: '15%',
                    marginLeft: "2%"
                  }}
                ></img>
                <div className="d-flex flex-column justify-content-center w-full">
                  <div
                    style={{
                      marginLeft:'5%',
                      fontWeight:'bold',
                      fontSize:'130%'
                    }}
                  >
                    Play a Friend
                  </div>
                  <div
                    style={{
                      marginLeft:'5%',
                    }}
                  >
                    Invite a friend to MinesweeperVs
                  </div>
                </div>
                {showPlayMenu && (
                  <div
                    className="convex-minesweeper-no-hover"
                    style={{
                      position: 'absolute',
                      top: '0',
                      right: 'calc(52% + 13vw)',
                      padding: '0.5rem',
                      zIndex: 100,
                      width: '13vw',
                      display:'flex',
                      flexDirection:'column',
                      maxHeight: '25vh', // 👈 set a fixed height for scroll
                      overflowY: 'auto',
                      justifyContent:'space-between',
                      alignItems:'center',
                      padding: '10px'
                    }}
                    onMouseLeave={playMenuOff}
                  >
                    {friends.map((friend) => (
                      <div 
                        key={friend.id} 
                        className="convex-minesweeper-no-hover"
                        style={{ padding: "0.5vw", marginTop: "1vh", display:"flex", alignItems:"center"}}
                        onClick={() => inviteFriend(friend.id)}
                      >
                        <img 
                          rel="preload"
                          src={friend?.profile_picture? `${friend?.profile_picture}` : "/empty-profile-example.jpg"}
                          style={{
                            height: '5vh',
                            borderRadius: '100%'
                          }}
                        />
                        <div style={{ marginLeft: "1%"}}>{friend.username}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div
              style={{ position: 'relative', width: '100%' }}
            >
              <div
                className="convex-minesweeper"
                style={{
                  width: '100%',
                  height:"10vh",
                  margin: 0,
                  marginBottom: '0.5rem',
                  cursor:'pointer',
                  display:'flex',
                  alignItems:'center',
                  padding:'1.5%'
                }}
              >
                <img 
                  src="/variants.png"
                  style={{
                    width: '15%',
                    marginLeft: "2%"
                  }}
                ></img>
                <div className="d-flex flex-column justify-content-center w-full">
                  <div
                    style={{
                      marginLeft:'5%',
                      fontWeight:'bold',
                      fontSize:'130%'
                    }}
                  >
                    More Coming Soon...
                  </div>
                  <div
                    style={{
                      marginLeft:'5%',
                    }}
                  >
                    More ways to enjoy, vote now
                  </div>
                </div>
              </div>
            </div>
            
            <div className="d-flex justify-content-center" style={{width:"100%", gap:"10%"}}>
              <div
                className="d-flex align-items-center"
                style={{height:"3vh", cursor:"pointer"}}
              >
                <img src="/History.png" style={{height:"75%", marginBottom:"4%"}}></img>
                <div>Game History</div>
              </div>
              <div
                className="d-flex align-items-center"
                style={{height:"3vh", cursor:"pointer"}}
              >
                <img 
                  src="/Statistics.png" 
                  style={{height:"75%"}}
                ></img>
                <div>Statistics</div>
              </div>
            </div>
          </>
        ):(
          <>
            <div style={{width: "100%", height: "100%", textAlign:"center"}}>
              Searching For Online Game
            </div>
            <button onClick={() => leaveOnlineGameQueue()}>
              Leave Queue
            </button>
          </>
        )}
      </div>
    </>
  )
}

export default PlayMenu