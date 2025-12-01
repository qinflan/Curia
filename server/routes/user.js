const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const { authenticateAccessToken, authenticateRefreshToken } = require('../middleware/validateJWT');

// non-protected routes
router.post('/register', UserController.registerUser);
router.post('/login', UserController.loginUser);
router.post('/refresh', authenticateRefreshToken, UserController.refresh);

// protected routes
router.get('/me', authenticateAccessToken, UserController.getUser);
router.delete('/delete', authenticateAccessToken, UserController.deleteUser);
router.put('/update', authenticateAccessToken, UserController.updateUser);

// protected routes for bill interactions
router.post('/bill/save/:billId', authenticateAccessToken, UserController.saveBill);
router.delete('/bill/unsave/:billId', authenticateAccessToken, UserController.unsaveBill);

// push notifications
router.post('/register-push-token', authenticateAccessToken, UserController.registerPushToken);


module.exports = router;