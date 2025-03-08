const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL, // Allow your frontend to connect
    methods: ["GET", "POST"],
  },
});

app.use(cors());

const users = new Map(); // Stores connected users: { socketId: { partner: socketId } }
const waitingUsers = new Set(); // Stores socketIds of users waiting for a match

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Add user to the waiting list
  users.set(socket.id, { partner: null });
  addToWaitingList(socket.id);

  // Send a message to the partner
  socket.on("sendMessage", (message) => {
    const user = users.get(socket.id);
    if (user && user.partner) {
      const timestamp = new Date().toLocaleTimeString(); // Get the current time
      io.to(user.partner).emit("receiveMessage", { text: message, timestamp });
    }
  });

  // Notify the partner when the user is typing
  socket.on("typing", () => {
    const user = users.get(socket.id);
    if (user && user.partner) {
      io.to(user.partner).emit("typing");
    }
  });

  // Notify the partner when the user stops typing
  socket.on("stoppedTyping", () => {
    const user = users.get(socket.id);
    if (user && user.partner) {
      io.to(user.partner).emit("stoppedTyping");
    }
  });

  // Handle "Next" button click
  socket.on("findNewChat", () => {
    console.log(`User ${socket.id} pressed Next`);
    removeUserFromMatch(socket.id);
    addToWaitingList(socket.id); // Add the user back to the waiting list
  });

  // Handle "New Chat" button click
  socket.on("findNewChatFromDisconnect", () => {
    console.log(`User ${socket.id} wants a new chat after disconnect`);
    addToWaitingList(socket.id); // Add the user back to the waiting list
  });

  // Handle user disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    removeUserFromMatch(socket.id);
  });
});

// Add a user to the waiting list and attempt to find a match
function addToWaitingList(socketId) {
  if (!users.has(socketId)) return;

  // Add the user to the waiting list
  waitingUsers.add(socketId);
  console.log(`Added ${socketId} to waiting list. Waiting users:`, [...waitingUsers]);

  // Check if there are 2 or more users waiting
  if (waitingUsers.size >= 2) {
    const [user1, user2] = [...waitingUsers];
    waitingUsers.delete(user1);
    waitingUsers.delete(user2);

    // Validate both users
    if (!users.has(user1)) {
      console.log(`Invalid user ${user1}, skipping...`);
      addToWaitingList(socketId); // Retry if the user is invalid
      return;
    }
    if (!users.has(user2)) {
      console.log(`Invalid user ${user2}, skipping...`);
      addToWaitingList(socketId); // Retry if the user is invalid
      return;
    }

    // Match the users
    users.get(user1).partner = user2;
    users.get(user2).partner = user1;

    // Notify both users of the match
    io.to(user1).emit("match");
    io.to(user2).emit("match");

    console.log(`Matched [ ${user1} ] with [ ${user2} ]`);
  }
}

// Remove a user from their current match
function removeUserFromMatch(socketId) {
  if (!users.has(socketId)) return;

  const user = users.get(socketId);
  const partnerId = user.partner;

  if (partnerId && users.has(partnerId)) {
    // Notify the partner that the user has left
    io.to(partnerId).emit("partnerLeft");
    users.get(partnerId).partner = null;

    // Add the partner back to the waiting list
    addToWaitingList(user);
    console.log(`Added partner ${user} back to waiting list`);
  }

  console.log( [...waitingUsers]);
}

server.listen(5000, () => {
  console.log("Server running on port 5000");
});