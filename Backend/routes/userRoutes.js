const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

// Public (no auth)
router.post('/register/request-otp', userController.requestRegistrationOTP);
router.post('/register', userController.registerWithOTP);
router.post('/login', userController.loginUser);
router.post('/forgot-password', userController.requestPasswordResetOTP);
router.post('/verify-reset-otp', userController.verifyPasswordResetOTP);
router.post('/reset-password', userController.resetPasswordWithOTP);

// Protected
router.get('/', auth, userController.getUsers);
router.get('/profile', auth, userController.getProfile);
router.get('/:id/banks', userController.getUserBanks);
router.get('/:id', auth, userController.getUserById);
router.put('/:id', auth, userController.updateUser);
router.delete('/:id', auth, userController.deleteUser);
router.post('/premium', userController.updatePremiumStatus);
router.post('/change-password', auth, userController.changePassword);

module.exports = router;
