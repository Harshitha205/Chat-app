// Backend/src/routes/auth.route.js

import express from 'express';
// Import controller functions with their EXACT exported names (lowercase)
import { login, signup, logout, checkAuth, updateProfile } from '../controllers/auth.controller.js';

// --- IMPORTANT: Import your authentication middleware ---
// Ensure this path is correct. Middleware typically lives in src/middleware
import protectRoute from '../middleware/protectRoute.js'; 

const router = express.Router();

// Authentication Routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/check", checkAuth);

// --- THIS IS THE ROUTE YOU ARE TRYING TO FIX ---
// It must be a PUT request, and it should be protected by your auth middleware
router.put("/update-profile", protectRoute, updateProfile); // <--- ENSURE THIS LINE IS PRESENT AND UNCOMMENTED

console.log("Auth routes loaded: /signup, /login, /logout, /check, /update-profile (PUT)"); // ADD THIS LOG

export default router; // Export the configured router