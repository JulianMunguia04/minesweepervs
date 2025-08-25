'use client';
import React, { useState, useRef, useEffect } from 'react';

const Sidebar = ({
  userData
}
) => {
  //Loggin In
  const [loggedIn, setLoggedIn] = useState(false)

  //All Menus
  const toggleAllMenusOff =() => {
    setShowPlayMenu(false);
    setShowLearnMenu(false);
    setShowNewsMenu(false);
    setShowSocialMenu(false);
    setShowMyAccountMenu(false);
    setShowMoreMenu(false);
  }

  // Play Menu
  const [showPlayMenu, setShowPlayMenu] = useState(false);
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

  //Learn Menu
  const [showLearnMenu, setShowLearnMenu] = useState(false);
  const learnTimeoutRef = useRef(null);
  const learnMenuOn = () => {
    toggleAllMenusOff()
    if (learnTimeoutRef.current) {
      clearTimeout(learnTimeoutRef.current);
    }
    setShowLearnMenu(true)
  };
  const learnMenuTimedOff = () => learnTimeoutRef.current = setTimeout(()=>{
    setShowLearnMenu(false)
  }, 500);
  const learnMenuOff = () => setShowLearnMenu(false);

  //News Menu
  const [showNewsMenu, setShowNewsMenu] = useState(false);
  const newsTimeoutRef = useRef(null);
  const newsMenuOn = () => {
    toggleAllMenusOff()
    if (newsTimeoutRef.current) {
      clearTimeout(newsTimeoutRef.current);
    }
    setShowNewsMenu(true)
  };
  const newsMenuTimedOff = () => newsTimeoutRef.current = setTimeout(()=>{
    setShowNewsMenu(false)
  }, 500);
  const newsMenuOff = () => setShowNewsMenu(false);

  //Social Menu
  const [showSocialMenu, setShowSocialMenu] = useState(false);
  const socialTimeoutRef = useRef(null);
  const socialMenuOn = () => {
    toggleAllMenusOff()
    if (socialTimeoutRef.current) {
      clearTimeout(socialTimeoutRef.current);
    }
    setShowSocialMenu(true)
  };
  const socialMenuTimedOff = () => socialTimeoutRef.current = setTimeout(()=>{
    setShowSocialMenu(false)
  }, 500);
  const socialMenuOff = () => setShowSocialMenu(false);

  //My Account Menu
  const [showMyAccountMenu, setShowMyAccountMenu] = useState(false);
  const myAccountTimeoutRef = useRef(null);
  const myAccountMenuOn = () => {
    toggleAllMenusOff()
    if (myAccountTimeoutRef.current) {
      clearTimeout(myAccountTimeoutRef.current);
    }
    setShowMyAccountMenu(true)
  };
  const myAccountMenuTimedOff = () => myAccountTimeoutRef.current = setTimeout(()=>{
    setShowMyAccountMenu(false)
  }, 500);
  const myAccountMenuOff = () => setShowMyAccountMenu(false);

  //More Menu
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const moreTimeoutRef = useRef(null);
  const moreMenuOn = () => {
    toggleAllMenusOff()
    if (moreTimeoutRef.current) {
      clearTimeout(moreTimeoutRef.current);
    }
    setShowMoreMenu(true)
  };
  const moreMenuTimedOff = () => moreTimeoutRef.current = setTimeout(()=>{
    setShowMoreMenu(false)
  }, 500);
  const moreMenuOff = () => setShowMoreMenu(false);

  return(
    <div
      className="position-fixed top-3 start-3 bottom-3"
      style={{ 
        width: '13vw', 
        backgroundColor:' #bdbdbd', 
        borderTop: '4px solid #ffffff',
        borderLeft: '4px solid #ffffff',
        borderBottom: '4px solid #7c7c7c',
        borderRight: '4px solid #7c7c7c',  
        display:'flex',
        flexDirection:'column',
        justifyContent:'space-between',
        alignItems:'center',
        padding: '10px'
      }}
    >
      {/* Top buttons */}
      <div style={{ width: '100%' }}>
        <div
          style={{
            width: "100%",
            height:'auto',
            margin:'0px',
            marginBottom:'0.5rem',
            cursor:'pointer'
          }}
          onClick={() => window.location.href = '/'}
        >
          <img src="logo-full.png"></img>
        </div>
        {/*Play Menu*/}
        <div
          style={{ position: 'relative', width: '100%' }}
          onMouseEnter={playMenuOn}
          onMouseLeave={playMenuTimedOff}
        >
          <div
            className="convex-minesweeper"
            style={{
              width: '100%',
              margin: 0,
              marginBottom: '0.5rem',
              cursor:'pointer',
              display:'flex',
              alignItems:'center',
              padding:'1.5%'
            }}
          >
            <img 
              src="play-icon.png"
              style={{
                width: '18%'
              }}
            ></img>
            <div
              style={{
                marginLeft:'5%',
                fontWeight:'bold',
                fontSize:'120%'
              }}
            >
              Play
            </div>
          </div>
          {showPlayMenu && (
            <div
              className="convex-minesweeper-no-hover"
              style={{
                position: 'absolute',
                top: '0',
                left: 'calc(100% + 10%)',
                padding: '0.5rem',
                zIndex: 100,
                width: '13vw',
                display:'flex',
                flexDirection:'column',
                justifyContent:'space-between',
                alignItems:'center',
                padding: '10px'
              }}
              onMouseLeave={playMenuOff}
            >
              <div
                className="convex-minesweeper"
                style={{
                  width: '100%',
                  margin: 0,
                  marginBottom: '0.5rem',
                  cursor:'pointer',
                  display:'flex',
                  alignItems:'center',
                  padding:'1.5%'
                }}
              >
                <img 
                  src="play-online.png"
                  style={{
                    width: '18%'
                  }}
                ></img>
                <div
                  style={{
                    marginLeft:'5%',
                    fontWeight:'bold',
                    fontSize:'120%'
                  }}
                >
                  Play Online
                </div>
              </div>
              <div
                className="convex-minesweeper"
                style={{
                  width: '100%',
                  margin: 0,
                  marginBottom: '0.5rem',
                  cursor:'pointer',
                  display:'flex',
                  alignItems:'center',
                  padding:'1.5%'
                }}
              >
                <img 
                  src="play-a-friend.png"
                  style={{
                    width: '18%'
                  }}
                ></img>
                <div
                  style={{
                    marginLeft:'5%',
                    fontWeight:'bold',
                    fontSize:'120%'
                  }}
                >
                  Play A Friend
                </div>
              </div>
              <div
                className="convex-minesweeper"
                style={{
                  width: '100%',
                  margin: 0,
                  marginBottom: '0.5rem',
                  cursor:'pointer',
                  display:'flex',
                  alignItems:'center',
                  padding:'1.5%'
                }}
              >
                <img 
                  src="variants.png"
                  style={{
                    width: '18%'
                  }}
                ></img>
                <div
                  style={{
                    marginLeft:'5%',
                    fontWeight:'bold',
                    fontSize:'120%'
                  }}
                >
                  More Coming Soon...
                </div>
              </div>
            </div>
          )}
        </div>
        {/*Learn Menu*/}
        <div
          style={{ position: 'relative', width: '100%' }}
          onMouseEnter={learnMenuOn}
          onMouseLeave={learnMenuTimedOff}
        >
          <div
            className="convex-minesweeper"
            style={{
              width: '100%',
              margin: 0,
              marginBottom: '0.5rem',
              cursor:'pointer',
              display:'flex',
              alignItems:'center',
              padding:'1.5%'
            }}
          >
            <img 
              src="Learn.png"
              style={{
                width: '18%'
              }}
            ></img>
            <div
              style={{
                marginLeft:'5%',
                fontWeight:'bold',
                fontSize:'120%'
              }}
            >
              Learn
            </div>
          </div>
          {showLearnMenu && (
            <div
              className="convex-minesweeper-no-hover"
              style={{
                position: 'absolute',
                top: '0',
                left: 'calc(100% + 10%)',
                padding: '0.5rem',
                zIndex: 100,
                width: '13vw',
                display:'flex',
                flexDirection:'column',
                justifyContent:'space-between',
                alignItems:'center',
                padding: '10px'
              }}
              onMouseLeave={learnMenuOff}
            >
              <div
                className="convex-minesweeper"
                style={{
                  width: '100%',
                  margin: 0,
                  marginBottom: '0.5rem',
                  cursor:'pointer',
                  display:'flex',
                  alignItems:'center',
                  padding:'1.5%'
                }}
              >
                <img 
                  src="Tutorial.png"
                  style={{
                    width: '18%',
                    paddingLeft: `2%`
                  }}
                ></img>
                <div
                  style={{
                    marginLeft:'5%',
                    fontWeight:'bold',
                    fontSize:'120%'
                  }}
                >
                 Minesweeper Tutorial
                </div>
              </div>
              <div
                className="convex-minesweeper"
                style={{
                  width: '100%',
                  margin: 0,
                  marginBottom: '0.5rem',
                  cursor:'pointer',
                  display:'flex',
                  alignItems:'center',
                  padding:'1.5%'
                }}
              >
                <img 
                  src="Minesweepervslogo.png"
                  style={{
                    width: '18%'
                  }}
                ></img>
                <div
                  style={{
                    marginLeft:'5%',
                    fontWeight:'bold',
                    fontSize:'120%'
                  }}
                >
                  Vs Tutorial
                </div>
              </div>
            </div>
          )}
        </div>
        {/*News Menu*/}
        <div
          style={{ position: 'relative', width: '100%' }}
          onMouseEnter={newsMenuOn}
          onMouseLeave={newsMenuTimedOff}
        >
          <div
            className="convex-minesweeper"
            style={{
              width: '100%',
              margin: 0,
              marginBottom: '0.5rem',
              cursor:'pointer'
            }}
          >
            News
          </div>
          {showNewsMenu && (
            <div
              className="convex-minesweeper-no-hover"
              style={{
                position: 'absolute',
                top: '0',
                left: 'calc(100% + 10%)',
                padding: '0.5rem',
                zIndex: 100,
                width: '13vw',
                display:'flex',
                flexDirection:'column',
                justifyContent:'space-between',
                alignItems:'center',
                padding: '10px'
              }}
              onMouseLeave={newsMenuOff}
            >
              <div className='convex-minesweeper'
                style={{
                  width: "100%",
                  height:'auto',
                  margin:'0px',
                  marginBottom:'0.5rem'
                }}
              >
                News
              </div>
            </div>
          )}
        </div>
        {/*Social Menu*/}
        <div
          style={{ position: 'relative', width: '100%' }}
          onMouseEnter={socialMenuOn}
          onMouseLeave={socialMenuTimedOff}
        >
          <div
            className="convex-minesweeper"
            style={{
              width: '100%',
              margin: 0,
              marginBottom: '0.5rem',
              cursor:'pointer'
            }}
          >
            Social
          </div>
          {showSocialMenu && (
            <div
              className="convex-minesweeper-no-hover"
              style={{
                position: 'absolute',
                top: '0',
                left: 'calc(100% + 10%)',
                padding: '0.5rem',
                zIndex: 100,
                width: '13vw',
                display:'flex',
                flexDirection:'column',
                justifyContent:'space-between',
                alignItems:'center',
                padding: '10px'
              }}
              onMouseLeave={socialMenuOff}
            >
              <div className='convex-minesweeper'
                style={{
                  width: "100%",
                  height:'auto',
                  margin:'0px',
                  marginBottom:'0.5rem'
                }}
              >
                Friends
              </div>
              <div className='convex-minesweeper'
                style={{
                  width: "100%",
                  height:'auto',
                  margin:'0px',
                  marginBottom:'0.5rem'
                }}
              >
                Messages
              </div>
              <div className='convex-minesweeper'
                style={{
                  width: "100%",
                  height:'auto',
                  margin:'0px',
                  marginBottom:'0.5rem'
                }}
              >
                Blog
              </div>
            </div>
          )}
        </div>
        {/*My Account Menu*/}
        <div
          style={{ position: 'relative', width: '100%' }}
          onMouseEnter={myAccountMenuOn}
          onMouseLeave={myAccountMenuTimedOff}
        >
          <div
            className="convex-minesweeper"
            style={{
              width: '100%',
              margin: 0,
              marginBottom: '0.5rem',
              cursor:'pointer'
            }}
          >
            My Account
          </div>
          {showMyAccountMenu && (
            <div
              className="convex-minesweeper-no-hover"
              style={{
                position: 'absolute',
                top: '0',
                left: 'calc(100% + 10%)',
                padding: '0.5rem',
                zIndex: 100,
                width: '13vw',
                display:'flex',
                flexDirection:'column',
                justifyContent:'space-between',
                alignItems:'center',
                padding: '10px'
              }}
              onMouseLeave={myAccountMenuOff}
            >
              <div className='convex-minesweeper'
                style={{
                  width: "100%",
                  height:'auto',
                  margin:'0px',
                  marginBottom:'0.5rem'
                }}
              >
                Statistics
              </div>
              <div className='convex-minesweeper'
                style={{
                  width: "100%",
                  height:'auto',
                  margin:'0px',
                  marginBottom:'0.5rem'
                }}
              >
                Game History
              </div>
            </div>
          )}
        </div>
        {/*More Menu*/}
        <div
          style={{ position: 'relative', width: '100%' }}
          onMouseEnter={moreMenuOn}
          onMouseLeave={moreMenuTimedOff}
        >
          <div
            className="convex-minesweeper"
            style={{
              width: '100%',
              margin: 0,
              marginBottom: '0.75rem',
              cursor:'pointer'
            }}
          >
            More
          </div>
          {showMoreMenu && (
            <div
              className="convex-minesweeper-no-hover"
              style={{
                position: 'absolute',
                top: '0',
                left: 'calc(100% + 10%)',
                padding: '0.5rem',
                zIndex: 100,
                width: '13vw',
                display:'flex',
                flexDirection:'column',
                justifyContent:'space-between',
                alignItems:'center',
                padding: '10px'
              }}
              onMouseLeave={moreMenuOff}
            >
              <div className='convex-minesweeper'
                style={{
                  width: "100%",
                  height:'auto',
                  margin:'0px',
                  marginBottom:'0.5rem'
                }}
              >
                More
              </div>
            </div>
          )}
        </div>
        <input 
          className="form-control search-home"
          style={{ width: '100%', height: '4vh', boxShadow:`none`, marginBottom: '0.75rem', }} 
          placeholder='Search'
        />
        {!userData && (
          <div 
            className="d-flex justify-content-between" 
            style={{
              height:'auto',
            }}
          >
            <div
              className="convex-red"
              style={{
                width: '47%',
                paddingTop: '',
                margin: 0,
                marginBottom: '0.5rem',
                cursor:'pointer',
                backgroundColor:`red`
              }}
              onClick={() => window.location.href = '/register'}
            >
              Sign Up
            </div>
            <div
              className="convex-darkgray"
              style={{
                width: '47%',
                paddingTop: '',
                margin: 0,
                marginBottom: '0.5rem',
                cursor:'pointer'
              }}
              onClick={() => window.location.href = '/login'}
            >
              Log In
            </div>
          </div>
        )}
      </div>

      {/* Bottom buttons */}
      <div style={{ width: '100%' }}>
        {userData && <button
          onClick={async () => {
            await fetch("/api/logout", { method: "POST", credentials: "include" });
            // Redirect user to login page or home
            window.location.href = "/";
          }}
        >
          Sign Out
        </button>}
        
        <div>Collapse</div>
        <div>Settings</div>
        <div>Support</div>
      </div>
    </div>
  );
}

export default Sidebar;