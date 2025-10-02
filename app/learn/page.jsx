"use client"

import React from 'react'
import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";

import Sidebar from "../../components/sidebar"

const Learn = () => {
  const router = useRouter();

  const [userData, setUserData] = useState(null);
  
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

  return(
    <>
        <Sidebar 
            userData={userData}
        />
        <main style={{marginLeft:'calc(13vw + 16px)', padding:'4%'}}>
          <div className='convex-minesweeper-no-hover' style={{padding:"3vw"}}>
            <div style={{display:"flex", alignItems:"center"}}>
              <img src="/Learn.png" style={{width: "4%"}}></img>
              <div style={{fontWeight:"bold", fontSize: "1.75vw"}}>Learn</div>
            </div>
            <div style={{display:'flex', flexDirection:'column', alignItems: "center", padding:"10px", width:"100%", marginTop: "4%"}}>
              <div style={{display:'flex', width:"80%", justifyContent:"space-around"}}>
                <div className="menu-buttons" style={{marginRight:'10%', width: "16vw", height: "18vw"}}
                  onClick={() => router.push('/social/friends')}
                >
                  <div style={{backgroundColor:"#B5FED9", display: "flex", alignItems: "center", justifyContent:"center", width: "16vw", height: "11vw", borderTopRightRadius:"1vw", borderTopLeftRadius:"1vw"}}>
                    <img src="/Tutorial.png" style={{width:'6vw', height: '6vw'}}></img>
                  </div>
                  <div style={{padding: "10%", width: "16vw", height: "7vw", backgroundColor: "#313131ff", borderBottomRightRadius:"1vw", borderBottomLeftRadius:"1vw"}}>
                    <div style={{marginLeft: "5%", fontWeight: "bold", color:"white", fontSize: "1vw"}}>Minesweeper Tutorial</div>
                    <div style={{marginLeft: "5%", color:"white", fontSize: "0.8vw"}}>Learn the classic rules of Minesweeper</div>
                  </div>
                </div>
                <div className="menu-buttons" style={{ width: "16vw", height: "18vw"}}
                  onClick={() => router.push('/social/messages')}
                >
                  <div style={{backgroundColor:"#98CBB4", display: "flex", alignItems: "center", justifyContent:"center", width: "16vw", height: "11vw", borderTopRightRadius:"1vw", borderTopLeftRadius:"1vw"}}>
                    <img src="/Minesweepervslogo.png" style={{width:'6vw', height: '6vw'}}></img>
                  </div>
                  <div style={{padding: "10%", width: "16vw", height: "7vw", backgroundColor: "#313131ff", borderBottomRightRadius:"1vw", borderBottomLeftRadius:"1vw"}}>
                    <div style={{marginLeft: "5%", fontWeight: "bold", color:"white", fontSize: "1vw"}}>Vs Tutorial</div>
                    <div style={{marginLeft: "5%", color:"white", fontSize: "0.8vw"}}>Learn the multiplayer game of minesweeper</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
    </>
  )
}

export default Learn
