const jwt = require("jsonwebtoken");

/**
 * Authentication middleware to verify JWT tokens
 * Extracts token from Authorization header and verifies it
 * Attaches user information to request object if valid
 */
const authMiddleware = (req, res, next) => {
    const authHeader = req.header("Authorization");
    
    // Check if token exists
    if (!authHeader) {
        return res.status(401).json({ 
            success: false,
            message: "No token, authorization denied" 
        });
    }
    
    try {
        // Extract token from "Bearer TOKEN" format
        const token = authHeader.split(" ")[1];
        
        if (!token) {
            return res.status(401).json({ 
                success: false,
                message: "No token, authorization denied" 
            });
        }
        
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Attach user information to request object
        req.user = decoded.user;
        next();
    } catch (error) {
        res.status(401).json({ 
            success: false,
            message: "Token is not valid" 
        });
    }
};

module.exports = authMiddleware;
