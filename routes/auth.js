const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();

// SIGNUP ROUTE
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        
        // Check if user exists
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'Email is already registered' });

        // Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Save User
        user = new User({ name, email, password: hashedPassword, role });
        await user.save();

        res.status(201).json({ msg: 'Signup successful' });
    } catch (err) {
        res.status(500).json({ msg: 'Server error during signup' });
    }
});

// LOGIN ROUTE
router.post('/login', async (req, res) => {
    try {
        const { email, password, role } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Username or password must be invalid' });

        // Check Role (Admin cannot login as User, etc.)
        if (user.role !== role) return res.status(400).json({ msg: 'Invalid role for this account' });

        // Match Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Username or password must be invalid' });

        res.status(200).json({ msg: 'Login successful' });
    } catch (err) {
        res.status(500).json({ msg: 'Server error during login' });
    }
});

module.exports = router;
