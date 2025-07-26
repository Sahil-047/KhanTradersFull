const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// Auth endpoints
router.post('/register/request-otp', authController.requestRegistrationOTP);
router.post('/register', authController.register);
router.post('/login/request-otp', authController.requestLoginOTP);
router.post('/login/otp', authController.loginWithOTP);
router.post('/login', authController.login);
router.post('/reset-password', authController.resetPassword);
router.post('/logout', auth, authController.logout);
router.post('/refresh', auth, authController.refreshToken);
router.get('/profile', auth, authController.getAdminProfile);

// Admin management endpoints
router.post('/', auth, adminController.createAdmin);
router.get('/', auth, adminController.getAdmins);
router.get('/:id', auth, adminController.getAdminById);
router.put('/:id', auth, adminController.updateAdmin);
router.delete('/:id', auth, adminController.deleteAdmin);

module.exports = router;
