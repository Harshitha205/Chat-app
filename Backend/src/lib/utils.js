// Backend/src/lib/utils.js

import jwt from "jsonwebtoken";

const generateToken = (userId, res) => {
    console.log("generateToken: Function called for userId:", userId); // Debug log

    if (!process.env.JWT_SECRET) {
        console.error("generateToken ERROR: JWT_SECRET is NOT defined in .env! Cannot generate token.");
        // We MUST send a response here, otherwise the request will hang
        // and the 'token is not defined' error will propagate.
        return res.status(500).json({ message: "Server configuration error: JWT secret missing." });
    }
    console.log("generateToken: JWT_SECRET is defined."); // Debug log

    let token; // Declare token outside try-catch to ensure scope
    try {
        token = jwt.sign({ userId }, process.env.JWT_SECRET, {
            expiresIn: "15d",
        });
        console.log("generateToken: Token signed successfully."); // Debug log
    } catch (signError) {
        console.error("generateToken ERROR: Failed to sign token:", signError.message);
        return res.status(500).json({ message: "Server error during token generation." });
    }

    if (!token) { // Double check if token is somehow still undefined
        console.error("generateToken ERROR: Token is unexpectedly undefined after signing attempt.");
        return res.status(500).json({ message: "Server error: Token not generated." });
    }

    res.cookie("jwt", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "lax", // Keeping 'lax' and 'secure: false' for development
        secure: false, // Ensure this is false for HTTP development
    });
    console.log("generateToken: Cookie set successfully for userId:", userId); // Debug log
};

export { generateToken };