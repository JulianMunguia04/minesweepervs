'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Sidebar = ({
  userData,
}
) => {
  const router = useRouter();

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
        padding: '10px',
        zIndex: 1000
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
          <img src="/logo-full.png"></img>
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
            onClick={() => router.push('/play')}
          >
            <img 
              src="/play-icon.png"
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
                  src="/play-online.png"
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
                  src="/play-a-friend.png"
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
                  Play a Friend
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
                  src="/variants.png"
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
            onClick={() => window.location.href = '/learn'}
          >
            <img 
              src="/Learn.png"
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
                onClick={() => window.location.href = '/learn/minesweeper'}
              >
                <img 
                  src="/Tutorial.png"
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
                onClick={() => window.location.href = '/learn/vs'}
              >
                <img 
                  src="/Minesweepervslogo.png"
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
              cursor:'pointer',
              display:'flex',
              alignItems:'center',
              padding:'1.5%'
            }}
            onClick={() => router.push('/news')}
          >
            <img 
              src="/News.png"
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
              News
            </div>
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
                  src="/News.png"
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
                  News
                </div>
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
              cursor:'pointer',
              display:'flex',
              alignItems:'center',
              padding:'1.5%'
            }}
            onClick={() => window.location.href = '/social'}
          >
            <img 
              src="/Social.png"
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
              Social
            </div>
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
                onClick={() => window.location.href = '/social/friends'}
              >
                <img 
                  src="/Friends.png"
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
                  Friends
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
                onClick={() => window.location.href = '/social/messages'}
              >
                <img 
                  src="/Messages.png"
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
                  Messages
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
                onClick={() => window.location.href = '/social/blog'}
              >
                <img 
                  src="/Blog.png"
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
                  Blog
                </div>
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
              cursor:'pointer',
              display:'flex',
              alignItems:'center',
              padding:'1.5%'
            }}
          >
            <img 
              rel="preload"
              src={userData?.profile_picture? `${userData?.profile_picture}` : "/My-Account.png"}
              style={{
                width: '18%',
                borderRadius: '100%'
              }}
            />
            <div
              style={{
                marginLeft:'5%',
                fontWeight:'bold',
                fontSize:'120%'
              }}
              onClick={() => {
                if (userData) {
                  window.location.href = `/profile/${userData.id}`;
                } else {
                  window.location.href = '/login';
                }
              }}
            >
              My Account
            </div>
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
                  src="/Statistics.png"
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
                  Statistics
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
                  src="/History.png"
                  style={{
                    width: '14%'
                  }}
                ></img>
                <div
                  style={{
                    marginLeft:'5%',
                    fontWeight:'bold',
                    fontSize:'120%'
                  }}
                >
                  Game History
                </div>
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
              marginBottom: '0.5rem',
              cursor:'pointer',
              display:'flex',
              alignItems:'center',
              padding:'1.5%'
            }}
          >
            <img 
              src="/More.png"
              style={{
                width: '18%',
                borderRadius: '100%'
              }}
            ></img>
            <div
              style={{
                marginLeft:'5%',
                fontWeight:'bold',
                fontSize:'120%'
              }}
            >
              More
            </div>
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
                  src="/More.png"
                  style={{
                    width: '14%'
                  }}
                ></img>
                <div
                  style={{
                    marginLeft:'5%',
                    fontWeight:'bold',
                    fontSize:'120%'
                  }}
                >
                  More
                </div>
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
        
        <div style={{cursor:"pointer"}}>Collapse</div>
        <div style={{cursor:"pointer"}}>Settings</div>
        <div style={{cursor:"pointer"}}>Support</div>
      </div>
    </div>
  );
}

export default Sidebar;