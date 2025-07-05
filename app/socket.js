import { io } from 'socket.io-client';

const socket = io('http://localhost:3000', {
  path: '/api/socketio',
});

// Optional: handle connection events here
socket.on('connect', () => {
  console.log('✅ Socket connected:', socket.id);
});

socket.on('disconnect', () => {
  console.log('❌ Socket disconnected');
});

export default socket;