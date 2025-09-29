const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const { authenticateAccessToken, authenticateRefreshToken } = require('../middleware/validateJWT');


router.post('/register', UserController.registerUser);
router.post('/login', UserController.loginUser);
router.post('/refresh', authenticateRefreshToken, UserController.refresh);


module.exports = router;