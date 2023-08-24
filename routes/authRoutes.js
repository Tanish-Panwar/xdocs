const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../schema/User');

const router = express.Router();

// 😄 ROUTE 1: User registration
router.post('/register', async (req, res) => {
    try {
        const { email } = req.body;

        // Check if user with email already exist.
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ msg: 'User with this email already exists'  });
        }

        // Saving user in DB.
        user = await User.create({
            email: email
        })
        
        // return response as authToken.
        const data = {
            user: {
                id: user.id
            }
        }
        const JWT_SECRET = "themostsecretkeythatcanprotectuser";
        const authtoken = jwt.sign(data, JWT_SECRET);
        
        res.status(201).json({ authtoken: authtoken, user_id: user.id });

    } catch (error) {
        res.status(500).json({ msg: 'An error occurred' });
    }
});





// 😄 ROUTE 2: User login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ error: 'User with this email does not exist' });
        }
        
        const data = {
            user: {
                id: user.id
            }
        }
        const JWT_SECRET = "themostsecretkeythatcanprotectuser";
        const authtoken = jwt.sign(data, JWT_SECRET);
        
        res.json({ authToken: authtoken, user_id: user.id });


    } catch (error) {
        res.status(500).json({ type: error, error: 'An error occurred' });
    }
});



  



module.exports = router;
