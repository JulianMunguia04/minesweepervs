import { createServer } from 'http';
import { Server } from 'socket.io';
import client from '../database/postgresdb.js';

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', async (socket) => {
  console.log('✅ New socket connected:', socket.id);

  socket.on('message', (data) => {
    console.log('💬 Message received:', data);
    io.emit('message', data);
  });

  socket.on('disconnect', () => {
    console.log('❌ Socket disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`🚀 Socket.IO server running on port ${PORT}`);
});

// const createTables = async ()=>{
//   try {
//     // Simple query to create a test table if it doesn't exist
//     const createTableQuery = `
//       CREATE TABLE IF NOT EXISTS test_table (
//         id SERIAL PRIMARY KEY,
//         message TEXT NOT NULL,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//       );
//     `;
//     await client.query(createTableQuery);
//     console.log('✅ test_table ensured in DB');
//   } catch (err) {
//     console.error('❌ DB error on socket connection:', err);
//   }
// }

// createTables();