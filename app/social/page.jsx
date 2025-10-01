"use client"

import React from 'react'
import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";

import Sidebar from "../../components/sidebar"

const Social = () => {
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
              <img src="/Social.png" style={{width: "4%"}}></img>
              <div style={{fontWeight:"bold", fontSize: "1.75vw"}}>Social</div>
            </div>
            <div style={{display:'flex', flexDirection:'column', alignItems: "center", padding:"10px", width:"100%", marginTop: "4%"}}>
              <div style={{display:'flex', width:"80%", justifyContent:"space-around"}}>
                <div className="menu-buttons" style={{marginRight:'10%', width: "10vw", height: "10vw"}}>
                  <div style={{width: "10vw", height: "5vw", backgroundColor: "blue", borderTopRightRadius:"20%"}}>Friends</div>
                </div>
                <div className="menu-buttons" style={{marginRight:'10%', width: "10vw", height: "10vw"}}>Messages</div>
                <div className="menu-buttons" style={{width: "10vw", height: "10vw"}}>Blog</div>
              </div>
            </div>
          </div>
        </main>
    </>
  )
}

export default Social
