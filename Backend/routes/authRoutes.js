const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

router.post('/register/request-otp', authController.requestRegistrationOTP);
router.post('/register', authController.register);
router.post('/login/request-otp', authController.requestLoginOTP);
router.post('/login/otp', authController.loginWithOTP);
router.post('/login', authController.login);
router.post('/logout', auth, authController.logout);
router.post('/refresh', auth, authController.refreshToken);
router.post('/reset-password', authController.resetPassword);
router.get('/profile', auth, authController.getAdminProfile);

module.exports = router;
