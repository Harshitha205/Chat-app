import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';


import authRoutes from './routes/auth.route.js';   
import messageRoutes from './routes/message.route.js'; 


import { connectDB } from './lib/db.js';
import { app, server } from "./lib/socket.js"; 
// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000; 
const __dirname = path.resolve(); 

const corsOptions = {
    origin: "http://localhost:5173", 
    credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

// --- CRITICAL: Ensure authRoutes is used here ---
app.use('/api/auth', authRoutes); 
app.use("/api/messages", messageRoutes);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../Frontend/vite-project/dist")));
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../Frontend", "vite-project", "dist", "index.html")); 
    });
}
server.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
    connectDB();
});