'use client';

import { useEffect, useState } from 'react';
import socket from './socket';

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
    <main>
      <h1>Home Directory</h1>
      <div>Data from socket:{state}</div>
    </main>
  );
}
