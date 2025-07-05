import { Server } from 'socket.io';

export default function handler(req, res) {
  if (!res.socket.server.io) {
    console.log('🧠 Setting up Socket.IO server');

    const io = new Server(res.socket.server, {
      path: '/api/socketio',
      cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        methods: ['GET', 'POST'],
      },
    });
  
    res.socket.server.io = io;

    io.on('connection', (socket) => {
      console.log('✅ New socket connected:', socket.id);

      socket.on('message', (data) => {
        console.log('💬 Message received:', data);
        io.emit('message', data); 
      });

      socket.on('disconnect', () => {
        console.log('❌ Socket disconnected:', socket.id);
      });
    });
  } else {
    console.log('🟡 Socket.IO server already running');
  }

  res.end();
}
