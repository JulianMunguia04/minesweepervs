"use client";

import React from 'react'
import { useState, useEffect, useCallback, useRef } from 'react';
import Sidebar from "../../../components/sidebar"
import Board from "../../../components/board"
import { useParams, useRouter } from "next/navigation";
import socket from '../../socket';
import OpponentBoard from "../../../components/opponentBoard"
import Ads from "../../../components/adexample"

const Game = () => {
  const params = useParams();
  const router = useRouter();
  const { gameid } = params;
  const [userData, setUserData] = useState(null);
  const [guestData, setGuestData] = useState(null);
  const [playerNumber, setPlayerNumber] = useState(null);
  const playerNumberRef = useRef(null);
  const [gameStarted, setGameStarted] = useState(false)

  const [gridData, setGridData] = useState(null);
  const [opponentGridData, setOpponentGridData] = useState(null);

  const [profile, setProfile] = useState(null);
  const [opponentProfile, setOpponentProfile] = useState(null);

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

  const [secondsTimer, setSecondsTimer] = useState(120);
  const [isTimerActive, setTimerIsActive] = useState(false);

  const [animationIntro, setAnimationIntro] = useState(true);
  const [animationLength, setAnimationLength] = useState(2);

  const [animationOutro, setAnimationOutro] = useState(false);
  const [endGameInformation, setEndGameInformation] = useState(null)
  const [animationOutroLength, setAnimationOutroLength] = useState(3); // Increased for better visibility

  useEffect(() => {
    if (playerNumber) {
      playerNumberRef.current = playerNumber;
    }
  }, [playerNumber]);

  useEffect(() => {
    let timer;

    if (isTimerActive && secondsTimer > 0) {
      timer = setInterval(() => {
        setSecondsTimer(prev => prev - 1);
      }, 1000);
    }

    if (secondsTimer === 0) {
      setTimerIsActive(false);
      setGameStarted(false)
      endGame()
    }

    return () => clearInterval(timer);
  }, [isTimerActive, secondsTimer]);

  const startTimer = (seconds) => {
    setSecondsTimer(seconds)
    if (secondsTimer > 0) {
      setTimerIsActive(true);
    }
  };

  const resetTimer = () => {
    setTimerIsActive(false);
    setSecondsTimer(10);
  };

  const endGame = () =>{
    socket.emit("end-game", points, gameid, playerNumber)
  }

  function secondsToDigits(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    // Format into M:SS (minutes, two-digit seconds)
    const timeStr = `${minutes}${seconds.toString().padStart(2, "0")}`;

    // Return as array of single digits
    return timeStr.split("").map(Number);
  }

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
    socket.on("game-started", (game, role, seconds)=>{
      console.log("GAME STARTED EVENT RECEIVED:", game);
      console.log("role ", playerNumberRef.current)
      console.log("player 1 ", game.player1)
      console.log("player 2 ", game.player2)
      if (role == "player1"){
        setProfile(game.player1)
        console.log("profile pic ", game.player1)
        setOpponentProfile(game.player2)
        setElo(game.player1.elo)
        console.log("Elo: ", game.player1.elo)
        setOpponentElo(game.player2.elo)
        console.log("opponent elo", game.player2.elo)
        setProfilePicture(game.player1.profile_picture)
        setOpponentProfilePicture(game.player2.profile_picture)

        //Set Grid (empty if no grid yet
        setGridData(game.player1_board)
        setOpponentGridData(game.player2_board)

        setAnimationIntro(true)
        setTimeout(()=>{
          //Start Game
          setGameStarted(true)
          startTimer(seconds)
        }, animationLength * 1000)
      }else if (role == "player2"){
        setProfile(game.player2)
        setOpponentProfile(game.player1)
        setElo(game.player2.elo)
        console.log("Elo: ", game.player2.elo)
        setOpponentElo(game.player1.elo)
        console.log("opponent elo", game.player1.elo)
        setProfilePicture(game.player2.profile_picture)
        setOpponentProfilePicture(game.player1.profile_picture)

        //Set Grid (empty if no grid yet
        setGridData(game.player2_board)
        setOpponentGridData(game.player1_board)

        setAnimationIntro(true)
        setTimeout(()=>{
          //Start Game
          setGameStarted(true)
          startTimer(seconds)
        }, animationLength * 1000)
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
      setClicker(false)
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

  const digits = secondsToDigits(secondsTimer);

  useEffect(() => {
    socket.on("game-ended", (gameId, player1, player2, result, winner) => {
      console.log(gameId, player1, player2, winner);
      console.log("result ", result)
      let winnerPlayer = null;
      console.log("player1 " , player1)
      if (winner === 'player1') {
        winnerPlayer = player1;
      } else if (winner === 'player2') {
        winnerPlayer = player2;
      }

      if (winnerPlayer) {
        setEndGameInformation({
          winnerPlayer: winnerPlayer,
          result: result,
          isDraw: false
        })
        console.log(`Winner is ${winnerPlayer.username}, player1 start elo: ${result.p1_starting_elo}, 
              ending elo: ${result.p1_ending_elo}, player2 start elo: ${result.p2_starting_elo}, ending elo: ${result.p2_ending_elo}`);
      } else {
        setEndGameInformation({
          winnerPlayer: null,
          result: result,
          isDraw: true
        })
        console.log(`It's a draw!`);
      }
      setAnimationOutro(true)
    });

    return () => {
      socket.off("game-ended");
    };
  }, []);

  const handlePlayAgain = () => {
    router.push('/play/');
  };

  return(
    <div>
      <Sidebar 
        userData={userData}
      />
      <main style={{marginLeft:'calc(13vw + 16px)', padding:'0.5rem'}}>
        <div 
          className="convex-minesweeper-no-hover"
          style={{
            margin: 0,
            marginTop:'2%',
            marginBottom: '0.5rem',
            cursor:'pointer',
            display:'flex',
            alignItems:'center',
            padding:'1.5%',
            width: 'fit-content',
            display:'flex',
            flexDirection:'column',
            cursor:'default',
            height: '90vh',
            position:'relative'
          }}
        >
          {animationIntro && profile && opponentProfile && (
            <div style={{
              position: 'absolute',
              top: '40%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '50vw',
              height: '20vh',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              zIndex: 10,
              display:'flex',
              gap:'10%',
              justifyContent:'center',
              alignItems:'center',
              animation: `fadeInOut ${animationLength}s ease-in-out forwards`,
              pointerEvents: 'none'
            }}>
              <div style={{
                display:'flex',
                justifyContent:'center',
                alignItems:'center'}}
              >
                <img 
                  rel="preload"
                  src={profile.profilePicture ? `${profile.profilePicture}` : "/empty-profile-example.jpg"}
                  style={{
                    width: '3.5vw',
                    height: '3.5vw',
                    borderRadius: '2vw'
                  }}
                ></img>
                  <div style={{marginLeft: '8%', fontWeight:'bold', width: '10vw', color:'white'}}>{profile.username}</div>
                  <div style={{marginLeft: '10%', width: '3.5vw', color: 'gray'}}>({profile.elo})</div>
              </div>
              <div style={{color:'white'}}>VS</div>
              <div style={{
                display:'flex',
                justifyContent:'center',
                alignItems:'center'}}
              >
                <img 
                  rel="preload"
                  src={opponentProfile.profilePicture ? `${opponentProfile.profilePicture}` : "/empty-profile-example.jpg"}
                  style={{
                    width: '3.5vw',
                    height: '3.5vw',
                    borderRadius: '2vw'
                  }}
                ></img>
                  <div style={{marginLeft: '8%', fontWeight:'bold', width: '10vw', color:'white'}}>{opponentProfile.username}</div>
                  <div style={{marginLeft: '10%', width: '3.5vw', color: 'gray'}}>({opponentProfile.elo})</div>
              </div>
            </div>
          )}

          {/* Game Ended Animation */}
          {animationOutro && profile && opponentProfile && endGameInformation && (
            <div style={{
              position: 'absolute',
              top: '40%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '60vw',
              height: '30vh',
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              zIndex: 10,
              display:'flex',
              flexDirection: 'column',
              justifyContent:'center',
              alignItems:'center',
              animation: `fadeIn ${animationOutroLength}s ease-in-out forwards`,
              borderRadius: '15px',
              border: '3px solid gold',
              padding: '2rem'
            }}>
              {endGameInformation.isDraw ? (
                <>
                  <div style={{
                    color: 'white',
                    fontSize: '3rem',
                    fontWeight: 'bold',
                    marginBottom: '1rem',
                    textAlign: 'center'
                  }}>
                    It's a Draw!
                  </div>
                  <div style={{
                    color: 'lightgray',
                    fontSize: '1.2rem',
                    marginBottom: '2rem',
                    textAlign: 'center'
                  }}>
                    Both players scored {points} points
                  </div>
                </>
              ) : (
                <>
                  <div style={{
                    color: 'gold',
                    fontSize: '2.5rem',
                    fontWeight: 'bold',
                    marginBottom: '1rem',
                    textAlign: 'center'
                  }}>
                    🏆 Winner! 🏆
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem'
                  }}>
                    <img 
                      src={endGameInformation.winnerPlayer.profilePicture ? `${endGameInformation.winnerPlayer.profilePicture}` : "/empty-profile-example.jpg"}
                      style={{
                        width: '4vw',
                        height: '4vw',
                        borderRadius: '2vw',
                        marginRight: '1rem'
                      }}
                      alt="Winner"
                    />
                    <div style={{
                      color: 'white',
                      fontSize: '2rem',
                      fontWeight: 'bold'
                    }}>
                      {endGameInformation.winnerPlayer.username}
                    </div>
                  </div>
                  <div style={{
                    color: 'lightgray',
                    fontSize: '1.2rem',
                    marginBottom: '1rem',
                    textAlign: 'center'
                  }}>
                    Final Score: {points} - {opponentPoints}
                  </div>
                </>
              )}
              
              <button
                onClick={handlePlayAgain}
                style={{
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  fontSize: '1.2rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  marginTop: '1rem',
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#45a049';
                  e.target.style.transform = 'scale(1.05)';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = '#4CAF50';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                Play Again
              </button>
            </div>
          )}
          <div style={{
            display:'flex',
            height: '9vh',
            width: '100%',
            justifyContent: 'space-between'
          }}>
            {!profile ? (
              <div
                className='concave-minesweeper-no-hover'
                style={{
                  height: '100%',
                  width: '30%',
                  display:'flex',
                  flexDirection:"column"
                }}
              >
                Loading...
              </div>
            ):(
              <div
                className='concave-minesweeper-no-hover'
                style={{
                  height: '100%',
                  width: '30%',
                  display:'flex',
                  flexDirection:"row",
                  paddingLeft: '2%',
                  alignItems:'center'
                }}
              >
                <img 
                  rel="preload"
                  src={profile.profilePicture ? `${profile.profilePicture}` : "/empty-profile-example.jpg"}
                  style={{
                    width: '3.5vw',
                    height: '3.5vw',
                    borderRadius: '2vw'
                  }}
                ></img>
                <div style={{marginLeft: '3%', fontWeight:'bold', width:'50%'}}>{profile.username}</div>
                <div style={{marginLeft: '1.5%', color: 'gray'}}>({profile.elo})</div> 
              </div>
            )}
            <div style={{backgroundColor:"black", height: '100%', display:'flex', padding: '0.5%', width: "13%"}}>
              <div style={{ display: "flex", width: '100%' }}>
                <img src={`/clock/clock-${digits[0]}.png`} alt={digits[0]} style={{marginRight:'5px',width: '33.3%'}}/>
                <img src={`/clock/clock-${digits[1]}.png`} alt={digits[1]} style={{width: '33.3%'}}/>
                <img src={`/clock/clock-${digits[2]}.png`} alt={digits[2]} style={{width: '33.3%'}}/>
              </div>
            </div>
            {!opponentProfile ? (
              <div
                className='concave-minesweeper-no-hover'
                style={{
                  height: '100%',
                  width: '30%',
                  display:'flex',
                  flexDirection:"column"
                }}
              >
                Loading...
              </div>
            ):(
              <div
                className='concave-minesweeper-no-hover'
                style={{
                  height: '100%',
                  width: '30%',
                  display:'flex',
                  flexDirection:"row",
                  paddingLeft: '2%',
                  alignItems:'center'
                }}
              >
                <img src={opponentProfile.profilePicture ? `${opponentProfile.profilePicture}` : "/empty-profile-example.jpg"}
                  style={{
                    width: '3.5vw',
                    height: '3.5vw',
                    borderRadius: '2vw'
                  }}
                ></img>
                <div style={{marginLeft: '3%', fontWeight:'bold', width:'50%'}}>{opponentProfile.username}</div>
                <div style={{marginLeft: '1.5%', color: 'gray'}}>({opponentProfile.elo})</div> 
              </div>
            )}
          </div>
          <div
            style={{
            margin: 0,
            marginBottom: '0.5rem',
            cursor:'pointer',
            display:'flex',
            alignItems:'center',
            padding:'1.5%',
            width: 'fit-content',
            display:'flex',
            justifyContent:"center",
            width: "70vw",
          }}
          >
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
            <div style={{width:"10%"}}></div>
            <OpponentBoard
              gameStarted = {clicker && !opponentShield}
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
        </div>
      </main>
      <Ads/>
    </div>
  )
}

export default Game;