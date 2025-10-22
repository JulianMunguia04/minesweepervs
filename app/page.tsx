'use client';

import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import socket from './socket';

import Sidebar from '../components/sidebar.js'

type UserData = {
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  date_of_birth?: string; 
  profile_picture?: string;
  games_played?: number;
  games_won?: number;
  elo: number;
  avg_points_per_second: number;
  created_at: string;
  id: string;
};

export default function Home() {
  const [state, setState] = useState("Inital Value");
  const [userData, setUserData] = useState<UserData | null>(null);

  const router = useRouter();

  useEffect(() => {
    const FRONTEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    
    fetch(`${FRONTEND_URL}/userdata`, {
      method: "GET",
      credentials: "include" // sends cookie automatically
    })
    .then(res => res.json())
    .then((data: UserData) => {
      console.log("User data:", data);
      setUserData(data);
    });
  }, []);

  useEffect(() => {
    socket.emit('message', 'Hello from page.tsx');

    socket.on('message', (data) => {
      console.log('📨 Received:', data);
      setTimeout(()=>{
        setState(data)
      },3000)
    });

    return () => {
      socket.off('message');
    };
  }, []);

  return (
    <>
      <Sidebar 
        userData={userData}
      />
      <main style={{marginLeft:'calc(13vw + 16px)', padding:'1.5%'}}>
          <div className='convex-minesweeper-no-hover' style={{padding:"1.5vw"}}>
            <div onClick={() => router.push('/')} style={{display:"flex", alignItems:"center"}} >
              <img src="/logo-full.png" style={{width: "20vw"}}></img>
            </div>
            <div style={{display:'flex', flexDirection:'column', alignItems: "center", padding:"10px", width:"100%", marginTop: "4%"}}>
              <div style={{display:'flex', width:"80%", justifyContent:"center"}}>
                <div className="menu-buttons" style={{marginRight:'7%', marginLeft:'7%',width: "16vw", height: "18vw"}}
                  onClick={() => router.push('/play')}
                >
                  <div style={{backgroundColor:"#E0E2DB", display: "flex", alignItems: "center", justifyContent:"center", width: "16vw", height: "11vw", borderTopRightRadius:"1vw", borderTopLeftRadius:"1vw"}}>
                    <img src="/play-icon.png" style={{width:'6vw', height: '6vw'}}></img>
                  </div>
                  <div style={{padding: "10%", width: "16vw", height: "7vw", backgroundColor: "#313131ff", borderBottomRightRadius:"1vw", borderBottomLeftRadius:"1vw"}}>
                    <div style={{marginLeft: "5%", fontWeight: "bold", color:"white", fontSize: "1vw"}}>Play</div>
                    <div style={{marginLeft: "5%", color:"white", fontSize: "0.8vw"}}>Play MinesweeperVS, matchmaking or with friends.</div>
                  </div>
                </div>
                <div className="menu-buttons" style={{marginRight:'7%', marginLeft:'7%', width: "16vw", height: "18vw"}}
                  onClick={() => router.push('/learn')}
                >
                  <div style={{backgroundColor:"#D2D4C8", display: "flex", alignItems: "center", justifyContent:"center", width: "16vw", height: "11vw", borderTopRightRadius:"1vw", borderTopLeftRadius:"1vw"}}>
                    <img src="/Learn.png" style={{width:'6vw', height: '6vw'}}></img>
                  </div>
                  <div style={{padding: "10%", width: "16vw", height: "7vw", backgroundColor: "#313131ff", borderBottomRightRadius:"1vw", borderBottomLeftRadius:"1vw"}}>
                    <div style={{marginLeft: "5%", fontWeight: "bold", color:"white", fontSize: "1vw"}}>Learn</div>
                    <div style={{marginLeft: "5%", color:"white", fontSize: "0.8vw"}}>Learn to play minesweeper and MinesweeperVs</div>
                  </div>
                </div>
                <div className="menu-buttons" style={{ marginRight:'7%', marginLeft:'7%', width: "16vw", height: "18vw"}}
                  onClick={() => router.push('/news')}
                >
                  <div style={{backgroundColor:"#B8BDB5", display: "flex", alignItems: "center", justifyContent:"center", width: "16vw", height: "11vw", borderTopRightRadius:"1vw", borderTopLeftRadius:"1vw"}}>
                    <img src="/news.png" style={{width:'6vw', height: '6vw'}}></img>
                  </div>
                  <div style={{padding: "10%", width: "16vw", height: "7vw", backgroundColor: "#313131ff", borderBottomRightRadius:"1vw", borderBottomLeftRadius:"1vw"}}>
                    <div style={{marginLeft: "5%", fontWeight: "bold", color:"white", fontSize: "1vw"}}>News</div>
                    <div style={{marginLeft: "5%", color:"white", fontSize: "0.8vw"}}>See what's new with MinesweeperVs</div>
                  </div>
                </div>
              </div>
              <div style={{display:'flex', width:"80%", justifyContent:"center", marginTop: "5vh"}}>
                <div className="menu-buttons" style={{marginRight:'7%', marginLeft:'7%',width: "16vw", height: "18vw"}}
                  onClick={() => router.push('/social')}
                >
                  <div style={{backgroundColor:"#889696", display: "flex", alignItems: "center", justifyContent:"center", width: "16vw", height: "11vw", borderTopRightRadius:"1vw", borderTopLeftRadius:"1vw"}}>
                    <img src="/social.png" style={{width:'6vw', height: '6vw'}}></img>
                  </div>
                  <div style={{padding: "10%", width: "16vw", height: "7vw", backgroundColor: "#313131ff", borderBottomRightRadius:"1vw", borderBottomLeftRadius:"1vw"}}>
                    <div style={{marginLeft: "5%", fontWeight: "bold", color:"white", fontSize: "1vw"}}>Social</div>
                    <div style={{marginLeft: "5%", color:"white", fontSize: "0.8vw"}}>Interact with friends and other playeres</div>
                  </div>
                </div>
                <div className="menu-buttons" style={{marginRight:'7%', marginLeft:'7%', width: "16vw", height: "18vw"}}
                      onClick={() => {
                    if (userData) {
                      window.location.href = `/profile/${userData.id}`;
                    } else {
                      window.location.href = '/login';
                    }
                  }}
                >
                  <div style={{backgroundColor:"#5F7470", display: "flex", alignItems: "center", justifyContent:"center", width: "16vw", height: "11vw", borderTopRightRadius:"1vw", borderTopLeftRadius:"1vw"}}>
                    <img src={userData?.profile_picture? `${userData?.profile_picture}` : "/My-Account.png"} style={{width:'6vw', height: '6vw', borderRadius: '100%'}}></img>
                  </div>
                  <div style={{padding: "10%", width: "16vw", height: "7vw", backgroundColor: "#313131ff", borderBottomRightRadius:"1vw", borderBottomLeftRadius:"1vw"}}>
                    <div style={{marginLeft: "5%", fontWeight: "bold", color:"white", fontSize: "1vw"}}>My Account</div>
                    <div style={{marginLeft: "5%", color:"white", fontSize: "0.8vw"}}>See account details, match history, and statistics</div>
                  </div>
                </div>
                <div className="menu-buttons" style={{ marginRight:'7%', marginLeft:'7%', width: "16vw", height: "18vw"}}
                  onClick={() => router.push('/more')}
                >
                  <div style={{backgroundColor:"#526460ff", display: "flex", alignItems: "center", justifyContent:"center", width: "16vw", height: "11vw", borderTopRightRadius:"1vw", borderTopLeftRadius:"1vw"}}>
                    <img src="/more.png" style={{width:'6vw', height: '6vw'}}></img>
                  </div>
                  <div style={{padding: "10%", width: "16vw", height: "7vw", backgroundColor: "#313131ff", borderBottomRightRadius:"1vw", borderBottomLeftRadius:"1vw"}}>
                    <div style={{marginLeft: "5%", fontWeight: "bold", color:"white", fontSize: "1vw"}}>More</div>
                    <div style={{marginLeft: "5%", color:"white", fontSize: "0.8vw"}}>See more...</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
    </>
  );
}
