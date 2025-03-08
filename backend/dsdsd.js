const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // Allow your React app to connect
    methods: ['GET', 'POST'],
  },
});

// Store connected users
const users = {};

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Add user to the users object
  users[socket.id] = socket;

  // Pair users randomly
  if (Object.keys(users).length >= 2) {
    const userIds = Object.keys(users);
    const user1 = users[userIds[0]];
    const user2 = users[userIds[1]];

    // Notify both users they are paired
    user1.emit('paired', { message: 'You are paired with a stranger!' });
    user2.emit('paired', { message: 'You are paired with a stranger!' });

    // Handle chat messages
    user1.on('send_message', (message) => {
      user2.emit('receive_message', message);
    });

    user2.on('send_message', (message) => {
      user1.emit('receive_message', message);
    });

    // Handle disconnection
    user1.on('disconnect', () => {
      user2.emit('stranger_disconnected');
      delete users[userIds[0]];
    });

    user2.on('disconnect', () => {
      user1.emit('stranger_disconnected');
      delete users[userIds[1]];
    });
  }

  // Handle single user disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
    delete users[socket.id];
  });
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});