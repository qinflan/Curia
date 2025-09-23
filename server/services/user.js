const User = require('../models/user');
const bcrypt = require('bcrypt');


class UserService {

    async registerUser(req, res) {
        const { username, email, password } = req.body;
        try {
            const existingUser = await User.findOne({ $or: [{ username }, { email }] });
            if (existingUser) {
                return res.status(400).json({ message: 'Username or email already exists' });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({ username, email, password: hashedPassword });
            await newUser.save();
            res.status(201).json({ message: 'User registered successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error });
        }
    };

    async loginUser(req, res) {
        const { username, password } = req.body;
        try {
            const user = await User.findOne({ username });
            if (!user) {
                return res.status(400).json({ message: 'Invalid username or password' });
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid username or password' });
            }
            res.status(200).json({ message: 'Login successful', userId: user._id });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error });
        }
    };
}


module.exports = new UserService();