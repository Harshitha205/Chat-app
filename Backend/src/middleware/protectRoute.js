// Backend/src/middleware/protectRoute.js
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js'; // Adjust path if needed

const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt; // Get JWT from cookie

        if (!token) {
            console.log("ProtectRoute: No token found in cookies.");
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        // Ensure JWT_SECRET is available
        if (!process.env.JWT_SECRET) {
             console.error("ProtectRoute: JWT_SECRET is not defined. Cannot verify token.");
             return res.status(500).json({ message: "Server configuration error: JWT secret missing." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token

        if (!decoded) {
            console.log("ProtectRoute: Invalid token decoded.");
            return res.status(401).json({ message: "Unauthorized: Invalid token" });
        }

        const user = await User.findById(decoded.userId).select("-password"); // Find user by ID from token

        if (!user) {
            console.log("ProtectRoute: User not found from decoded token ID.");
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user; // Attach user to request object
        console.log("ProtectRoute: User authenticated:", req.user.username); // Log successful authentication
        next(); // Proceed to the next middleware/controller
    } catch (error) {
        console.error("Error in protectRoute middleware:", error.message);
        // If token is malformed or expired, jwt.verify will throw an error
        res.status(401).json({ message: "Unauthorized: Token verification failed." });
    }
};

export default protectRoute;