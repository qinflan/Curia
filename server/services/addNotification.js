const User = require('../models/user');
const { v4: uuidv4 } = require('uuid');

async function addNotificationToInbox(userId, { title, body, billId = null }) {
    try {
        const user = await User.findById(userId);
        if (!user) {
            console.error("User not found for notification:", userId);
            return;
        }

        const notification = {
            id: uuidv4(),
            title,
            body,
            bill: billId || undefined,
            read: false,
            createdAt: new Date()
        };

        user.inbox.push(notification);
        await user.save();
    } catch (error) {
        console.error("Error adding notification to inbox:", error);
    }
}

module.exports = addNotificationToInbox;