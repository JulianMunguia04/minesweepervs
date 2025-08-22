'use client';

import { useEffect, useState } from 'react';
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
};

export default function Home() {
  const [state, setState] = useState("Inital Value");
  const [userData, setUserData] = useState<UserData | null>(null);

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
      <main style={{marginLeft:'calc(13vw + 16px)', padding:'0.5rem'}}>
        <h1>Home Directory</h1>
        <div>Data from socket:{state}</div>
        {userData && (
          <div>
            <h2>User Info</h2>
            <p>Username: {userData.username}</p>
            <p>Email: {userData.email}</p>
            <p>ELO: {userData.elo}</p>
            <p>Avg Points/sec: {userData.avg_points_per_second}</p>
            <p>Created At: {new Date(userData.created_at).toLocaleString()}</p>
          </div>
        )}
      </main>
    </>
  );
}
