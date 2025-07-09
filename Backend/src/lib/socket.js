// Backend/src/lib/socket.js
import { Server } from "socket.io";
import http from "http";
import express from "express"; // Assuming express is needed for the app instance

const app = express(); // Initialize Express app
const server = http.createServer(app); // Create HTTP server using Express app

// Initialize Socket.IO server
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"], // Your frontend development origin
        methods: ["GET", "POST"]
    }
});

// Map to store connected users' socket IDs
// Key: userId, Value: socketId
const userSocketMap = {}; // Private to this module, so no 'export' needed for it

// Helper function to get a user's socket ID
// This is the function that needs to be exported
const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
};

// Socket.IO connection handling
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    const userId = socket.handshake.query.userId; // Get userId from handshake query

    if (userId) {
        userSocketMap[userId] = socket.id; // Store userId-socketId mapping
    }

    // Emit online users to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    // Handle disconnects
    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
        // Remove user from map on disconnect
        for (const id in userSocketMap) {
            if (userSocketMap[id] === socket.id) {
                delete userSocketMap[id];
                break;
            }
        }
        // Emit updated online users list
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

// --- EXPORT REQUIRED VARIABLES AND FUNCTIONS ---
// 'app' and 'server' are needed by index.js
// 'io' and 'getReceiverSocketId' are needed by message.controller.js
export { app, io, server, getReceiverSocketId }; // <--- THIS IS THE CRITICAL EXPORT LINE