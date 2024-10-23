const User = require('../models/User.js');
const jwt = require('jsonwebtoken');

// Function to get user by ID
async function getuserById(id) {
    return User.findById(id).select("_id username email");
}

// Custom middleware for authorization
const isAuthorized = async (req, res, next) => {
    let token;

    // Check if the token is provided in the headers
    if (req.headers['x-auth-token']) {
        try {
            token = req.headers['x-auth-token']; // Extract token from headers
            const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
            
            // Get user information based on decoded ID
            req.user = await getuserById(decoded.id);
            next(); // Proceed to the next middleware or route handler
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal server error");
        }
    } else {
        res.status(401).send("Authorization token is required");
    }
};

module.exports = { isAuthorized };

// const jwt = require('jsonwebtoken');

// // Middleware to verify token and attach user to req object
// function authMiddleware(req, res, next) {
//   const token = req.headers.authorization?.split(' ')[1];
//   if (!token) return res.status(401).json({ message: 'Authentication token missing' });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace with your actual JWT secret
//     req.user = decoded; // Attach user information to the request object
//     next();
//   } catch (error) {
//     res.status(401).json({ message: 'Invalid token' });
//   }
// }
