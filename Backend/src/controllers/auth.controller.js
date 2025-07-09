// Backend/src/controllers/auth.controller.js
// This file contains the logic for your authentication routes.

import { generateToken } from "../lib/utils.js"; // Ensure this path and named export are correct in utils.js
import User from "../models/user.model.js"; // Adjust path if needed
import bcrypt from "bcryptjs"; // Ensure bcryptjs is installed
import cloudinary from "../lib/cloudinary.js"; // Adjust path if needed, ensure cloudinary is configured

// --- Ensure 'export const' is used for ALL functions that are imported by routes ---

export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;
    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        const user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "Email already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
        });

        if (newUser) {
            generateToken(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic, // Make sure newUser has this property or set a default
            });
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }
    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const login = async (req, res) => { // This is exported as 'login'
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        generateToken(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic, // Make sure user has this property or set a default
        });
    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const logout = (req, res) => { // This is exported as 'logout'
    try {
        res.cookie("jwt", "", { maxAge: 0 }); // Clears the 'jwt' cookie
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const updateProfile = async (req, res) => { // This is exported as 'updateProfile'
    try {
        const { profilePic } = req.body;
        // req.user._id is expected to be set by a middleware (like protectRoute)
        const userId = req.user._id; 

        if (!profilePic) {
            return res.status(400).json({ message: "Profile pic is required" });
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic); // Ensure cloudinary is set up
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePic: uploadResponse.secure_url },
            { new: true } // Returns the updated document
        );

        res.status(200).json(updatedUser);
    } catch (error) {
        console.log("error in update profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// This is also exported as 'checkAuth'
export const checkAuth = async (req, res) => {
    try {
        // req.user is expected to be populated by the protectRoute middleware
        if (!req.user || !req.user._id) {
            return res.status(401).json({ error: "Not authenticated: No user in request." });
        }
        const user = await User.findById(req.user._id).select("-password"); // Fetch user data excluding password
        if (!user) {
            return res.status(404).json({ error: "User not found after authentication." });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error("Error in checkAuth controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};