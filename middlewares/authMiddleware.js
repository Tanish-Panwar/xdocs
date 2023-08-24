const jwt = require('jsonwebtoken');
const User = require('../schema/User');
const JWT_SECRET = "themostsecretkeythatcanprotectuser";

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header('Authorization');
        // console.log('Received token:', token);

        const decoded = jwt.verify(token, JWT_SECRET);
        // console.log('Decoded token:', decoded);

        const user_id = decoded.user.id;

        const user = await User.findOne({ _id: user_id });
        // console.log('Found user:', user);

        if (!user) {
            throw new Error();
        }

        req.user = user;
        req.token = token;
        next();

    } catch (error) {
        console.error('Error:', error);
        res.status(401).json({ error: 'Unauthorized access' });
    }
};


module.exports = authMiddleware;
