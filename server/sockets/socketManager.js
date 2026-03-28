const { Server } = require('socket.io');

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // User joins a personal room (for personal notifications)
    socket.on('join', (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined their personal room`);
    });

    // Handle chat messages
    socket.on('sendMessage', ({ senderId, receiverId, message }) => {
      io.to(receiverId).emit('receiveMessage', { senderId, message });
    });

    // SOS Alert
    socket.on('sendSOS', ({ userId, name, location, contacts }) => {
      // Broadcast to all active users as a safety measure
      socket.broadcast.emit('emergencyAlert', { userId, name, location, contacts });
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};

module.exports = { initSocket, getIO };
