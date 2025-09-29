const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('./jwt');
const generateAccessToken = require('./jwt').generateAccessToken;
const generateRefreshToken = require('./jwt').generateRefreshToken;


class UserService {

    async registerUser(req, res) {
        const { email, password } = req.body;
        try {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'Username or email already exists' });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({ email, password: hashedPassword });
            await newUser.save();

            const accessToken = generateAccessToken({ 
                userId: newUser._id, 
                email: newUser.email 
            });
            const refreshToken = generateRefreshToken({ 
                userId: newUser._id, 
                email: newUser.email 
            });

            res.status(201).json({ userId: newUser._id, accessToken: accessToken, refreshToken: refreshToken });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error });
        }
    };

    async loginUser(req, res) {
        const { email, password } = req.body;
        try {
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: 'Invalid username or password' });
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid username or password' });
            }

            const accessToken = generateAccessToken({ 
                userId: user._id, 
                email: user.email 
            });
            const refreshToken = generateRefreshToken({
                userId: user._id,
                email: user.email
            });

            res.status(200).json({userId: user._id, accessToken: accessToken, refreshToken: refreshToken });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error });
        }
    };

    async refresh(req, res) {
        try {
            const accessToken = jwt.generateAccessToken({
                userId: req.user.userId,
                email: req.user.email,
            });

            return res.json({ accessToken });
        } catch (error) {
            return res.status(403).json({ message: 'Server error', error });
        }
    };

};


module.exports = new UserService();