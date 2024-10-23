const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const dotenv = require('dotenv');
const User = require('../models/User.js');

dotenv.config();

// Function to generate a JWT token
function generateToken(id) {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' }); // Set expiration time for the token
}

// Function to get user by email
async function getByEmail(email) {
    return User.findOne({ email });
}

// Registration process
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        let user = await getByEmail(email); // Use email directly
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({ username, email, password: hashedPassword });

        await user.save();
        const token = generateToken(user._id);
        res.status(201).json({ message: 'User registered successfully', token });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login process
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await getByEmail(email);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = generateToken(user._id);
        res.status(200).json({ message: 'Logged in successfully', token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});


// Forgot password route
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User with this email does not exist' });
        }

        const token = generateToken(user._id);

        // Instead of sending an email, return the token in the response
        res.status(200).json({
            message: 'Password reset token generated successfully',
            token, // The token is now part of the response
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Reset password route
router.post('/reset-password/:token', async (req, res) => {
    const { password } = req.body;
    const { token } = req.params;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(400).json({ message: 'Invalid token or user not found' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Password reset successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Invalid or expired token' });
    }
});



const AuthRouter = router;

module.exports = AuthRouter;