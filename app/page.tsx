'use client';

import { useEffect, useState } from 'react';
import socket from './socket';

import Sidebar from '../components/sidebar.js'

export default function Home() {
  const [state, setState] = useState("Inital Value");

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
      <Sidebar />
      <main style={{marginLeft:'calc(13vw + 16px)', padding:'0.5rem'}}>
        <h1>Home Directory</h1>
        <div>Data from socket:{state}</div>
      </main>
    </>
  );
}
