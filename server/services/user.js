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

    async getUser(req, res) {
        const userId = req.user.userId;
        try {
            const user = await User.findById(userId).select('-password');
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            return res.status(200).json(user);
        } catch (error) {
            return res.status(500).json({ message: 'Server error', error });
        }
    }

    async deleteUser(req, res) {
        const userId = req.user.userId;
        try {
            const user = await User.findByIdAndDelete(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            return res.status(200).json({ message: 'User deleted successfully' });
        } catch (error) {
            return res.status(500).json({ message: 'Server error', error });
        }
    }

    async updateUser(req, res) {
        const userId = req.user.userId;
        const updates = { ...req.body };

        try {
            if (updates.password) {
                updates.password = await bcrypt.hash(updates.password, 10);
            }

            if (updates.preferences) {
            const user = await User.findById(userId);
            updates.preferences = {
                ...user.preferences?.toObject(),
                ...updates.preferences
            };
        }

            const updatedUser = await User.findByIdAndUpdate(
                userId,
                { $set: updates },
                { new: true, runValidators: true, context: 'query'}
            ).select('-password');
            
            if (!updatedUser) {
                return res.status(404).json({message: 'User not found'});
            }

            return res.status(200).json(updatedUser);

        } catch (error) {
            return res.status(500).json({message: 'Server error', error});
        }
    }

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

    // Bill interaction methods
    async saveBill(req, res) {
        const userId = req.user.userId;
        const { billId } = req.params;
        try {
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            if (user.savedBills.includes(billId)) {
                return res.status(400).json({ message: 'Bill already saved' });
            }
            user.savedBills.push(billId);
            await user.save();
            return res.status(200).json({ message: 'Bill saved successfully' });
        } catch (error) {
            return res.status(500).json({ message: 'Server error', error });
        }
    }

    async unsaveBill(req, res) {
        const userId = req.user.userId;
        const { billId } = req.params;
        try {
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            user.savedBills = user.savedBills.filter(id => id.toString() !== billId);
            await user.save();
            return res.status(200).json({ message: 'Bill removed successfully' });
        }
        catch (error) {
            return res.status(500).json({ message: 'Server error', error });
        }  
    }

    async registerPushToken(req, res) {
        const userId = req.user.userId;
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({ message: "Push token is required" });
        }

        try {
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            // avoid duplicates
            if (!user.expoPushTokens.includes(token)) {
                user.expoPushTokens.push(token);
                await user.save();
            }

            return res.status(200).json({ message: "Push token registered" });
        } catch (error) {
            return res.status(500).json({ message: 'Server error', error });
        }

    }

    async getNotifications(req, res) {
        const userId = req.user.userId;
        try {
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            return res.status(200).json(
                user.inbox.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            );
        } catch (error) {
            return res.status(500).json({ message: 'Server error', error });
        }
    }

    async markNotificationRead(req, res) {
        const userId = req.user.userId;
        const { notificationId } = req.params;
        try {
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            const notification = user.inbox.id(notificationId);
            if (!notification) {
                return res.status(404).json({ message: "Notification not found" });
            } 
            notification.read = true;

            // clean up notifs older than two weeks that are read
            const twoWeeks = 14 * 24 * 60 * 60 * 1000;
            const now = Date.now();

            user.inbox = user.inbox.filter(n => {
                if (!n.read) return true;
                const age = now - new Date(n.createdAt).getTime();
                return age < twoWeeks;
            });
            await user.save();
            return res.status(200).json({ message: "Notification marked as read" });
        } catch (error) {
            return res.status(500).json({ message: 'Server error', error });
        }
    }

    async addNotificationToInbox(req, res) {
        const userId = req.user.userId;
        try {
            const user = await User.findById(userId);
            if (!user) {
                console.error("User not found for notification:", userId);
                return;
            }
            user.inbox.push(notification);
            await user.save();
        } catch (error) {
            console.error("Error adding notification to inbox:", error);
        }
    }
};


module.exports = new UserService();