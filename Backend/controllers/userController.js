const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const User = require('../models/User');
const Bank = require('../models/Bank');
const OTP = require('../models/OTP');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// 🔐 Password hash helper
const hashPassword = async (password) => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

// 📩 Request OTP
const { createOTP, verifyOTP } = require('../utils/otpUtils');

const requestRegistrationOTP = async (req, res) => {
  try {
    const { email, username, password, role = 'user' } = req.body;
    if (!email || !password || !username) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Use the OTP utility to generate, store, and email the OTP
    await createOTP(email, 'registration');

    res.status(200).json({ message: 'OTP sent successfully', email });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📝 Register with OTP
const registerWithOTP = async (req, res) => {
  try {
    const { email, password, username, otp, role = 'user' } = req.body;

    const record = await OTP.findOne({
      email,
      otp, 
      type: 'registration', 
      is_used: false
    });

    if (!record) return res.status(400).json({ message: 'Invalid OTP' });
    if (new Date(record.expires_at) < new Date()) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    const hashedPassword = await hashPassword(password);
    const newUser = await User.create({
      email,
      password: hashedPassword,
      username,
      role,
      created_at: new Date()
    });

    await OTP.findByIdAndUpdate(record._id, { is_used: true });

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser._id,
        email: newUser.email,
        username: newUser.username,
        role: newUser.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔐 Login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Change password for authenticated user
const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new password are required.' });
    }
    
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect.' });
    
    user.password = newPassword;
    await user.save(); // Will trigger the password hashing pre-save hook
    
    res.status(200).json({ message: 'Password changed successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Request OTP for password reset
const requestPasswordResetOTP = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });
  
  // Always respond with success for privacy
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(200).json({ message: 'If the email exists, an OTP has been sent.' });
  }
  
  await createOTP(email, 'password_reset');
  return res.status(200).json({ message: 'If the email exists, an OTP has been sent.' });
};

// Verify OTP for password reset
const verifyPasswordResetOTP = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ message: 'Email and OTP are required' });
  
  try {
    await verifyOTP(email, otp, 'password_reset');
    return res.status(200).json({ message: 'OTP verified. You may now reset your password.' });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

// Reset password using OTP
const resetPasswordWithOTP = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    return res.status(400).json({ message: 'Email, OTP, and new password are required' });
  }
  
  try {
    // Verify OTP (will throw if invalid/expired/used)
    await verifyOTP(email, otp, 'password_reset');
    
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    user.password = newPassword;
    await user.save(); // Will trigger the password hashing pre-save hook
    
    return res.status(200).json({ message: 'Password has been reset successfully.' });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

// 👥 Get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔍 Get user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('bank_id');

    if (!user) return res.status(404).json({ error: 'User not found' });

    const userObj = user.toObject();
    userObj.bank_details = userObj.bank_id || null;
    delete userObj.bank_id;

    res.json(userObj);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✏️ Update user
const updateUser = async (req, res) => {
  try {
    const update = { ...req.body };
    
    // Handle password separately to ensure it's hashed
    if (update.password) {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ error: 'User not found' });
      
      user.password = update.password;
      await user.save();
      
      delete update.password; // Remove from regular update
    }

    // Update remaining fields
    if (Object.keys(update).length > 0) {
      const user = await User.findByIdAndUpdate(
        req.params.id,
        { $set: update },
        { new: true, runValidators: true }
      ).select('-password');
      
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.json(user);
    } else {
      const user = await User.findById(req.params.id).select('-password');
      res.json(user);
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ❌ Delete user
const deleteUser = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🌟 Update Premium Status
const updatePremiumStatus = async (req, res) => {
  try {
    const { userId, is_premium, premium_expiry } = req.body;
    const updateFields = { is_premium };
    if (premium_expiry !== null && premium_expiry !== undefined && premium_expiry !== '') {
      updateFields.premium_expiry = premium_expiry;
    }
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!user) return res.status(404).json({ error: 'User not found' });
    console.log('User updated successfully:', user._id, user.is_premium);
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 👤 Get logged-in user's profile
const getProfile = async (req, res) => {
  console.log('Fetching profile for user:', req);
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('bank_id')
      .lean();
      
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Get all bank accounts for this user
    const bankAccounts = await Bank.find({ user_id: req.user.id });
    
    user.bank = user.bank_id || null;
    user.bank_accounts = bankAccounts || [];
    delete user.bank_id;
    
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const getUserBanks = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }
    
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Get all bank accounts for this user
    const bankAccounts = await Bank.find({ user_id: userId });
    
    console.log(`Found ${bankAccounts.length} bank accounts for user ${userId}`);
    res.json(bankAccounts);
  } catch (err) {
    console.error('Error fetching user banks:', err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  requestRegistrationOTP,
  registerWithOTP,
  loginUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  updatePremiumStatus,
  getProfile,
  changePassword,
  requestPasswordResetOTP,
  verifyPasswordResetOTP,
  resetPasswordWithOTP,
  getUserBanks
};
