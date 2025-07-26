const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const Admin = require('../models/Admin');
const AdminSession = require('../models/AdminSession');
const { createOTP, verifyOTP } = require('../utils/otpUtils');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const ADMIN_SECURITY_CONFIG = {
  MAX_LOGIN_ATTEMPTS: 3,
  LOCKOUT_DURATION: 30 * 60 * 1000,
  SESSION_TIMEOUT: 2 * 60 * 60 * 1000
};

// 🔐 Token generator with session
const generateToken = async (admin, userAgent, ipAddress) => {
  const tokenId = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + ADMIN_SECURITY_CONFIG.SESSION_TIMEOUT);

  await AdminSession.create({
    admin_id: admin._id,
    token_id: tokenId,
    created_at: new Date(),
    expires_at: expiresAt,
    ip_address: ipAddress,
    user_agent: userAgent
  });

  const token = jwt.sign(
    {
      id: admin._id,
      username: admin.username,
      role: admin.role,
      tokenId,
      sessionExpiresAt: expiresAt
    },
    JWT_SECRET,
    { expiresIn: '2h' }
  );

  return { token, tokenId, expiresAt };
};

// 📩 Register OTP
exports.requestRegistrationOTP = async (req, res) => {
  try {
    const { email, username } = req.body;
    const exists = await Admin.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already in use' });

    await createOTP(email, 'registration');
    res.json({ message: 'OTP sent to email' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// 📝 Register
exports.register = async (req, res) => {
  try {
    // Check if an admin already exists
    const adminCount = await Admin.countDocuments();
    if (adminCount > 0) {
      return res.status(400).json({ message: 'Only one admin is allowed in the system.' });
    }
    const { email, username, password, otp } = req.body;
    await verifyOTP(email, otp, 'registration');
    
    const admin = await Admin.create({
      email,
      username,
      password, // Will be hashed by pre-save middleware
      role: 'admin',
      is_email_verified: true,
      created_at: new Date()
    });
    
    const { token } = await generateToken(admin, req.get('User-Agent'), req.ip);
    res.status(201).json({
      message: 'Admin registered successfully',
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        username: admin.username
      }
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// 📩 Login OTP request
exports.requestLoginOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: 'Invalid email' });

    if (admin.lockout_until && admin.lockout_until > new Date()) {
      return res.status(403).json({ message: 'Account locked. Try again later.' });
    }

    await createOTP(email, 'login');
    res.json({ message: 'OTP sent' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// 🔐 OTP Login
exports.loginWithOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: 'Invalid email' });

    await verifyOTP(email, otp, 'login');

    await Admin.findByIdAndUpdate(admin._id, {
      $set: {
        login_attempts: 0,
        lockout_until: null,
        last_login_at: new Date()
      }
    });

    const { token } = await generateToken(admin, req.get('User-Agent'), req.ip);

    res.json({
      message: 'Login successful',
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        username: admin.username
      }
    });
  } catch (err) {
    await Admin.updateOne(
      { email: req.body.email },
      { $inc: { login_attempts: 1 } }
    );
    res.status(400).json({ message: err.message });
  }
};

// 🧾 Email/Password login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });

    if (!admin || !(await admin.matchPassword(password))) {
      await Admin.updateOne(
        { email },
        { $inc: { login_attempts: 1 } }
      );
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (admin.lockout_until && admin.lockout_until > new Date()) {
      return res.status(403).json({ message: 'Account locked. Try again later.' });
    }

    await Admin.findByIdAndUpdate(admin._id, {
      $set: {
        login_attempts: 0,
        lockout_until: null,
        last_login_at: new Date()
      }
    });

    const { token } = await generateToken(admin, req.get('User-Agent'), req.ip);

    res.json({
      message: 'Login successful',
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        username: admin.username
      }
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// 🚪 Logout
exports.logout = async (req, res) => {
  try {
    const tokenId = req.admin.tokenId;
    const deleted = await AdminSession.findOneAndDelete({ token_id: tokenId });

    if (!deleted) {
      return res.status(400).json({ message: 'Session not found or already expired.' });
    }

    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔄 Refresh JWT token
exports.refreshToken = async (req, res) => {
  try {
    const session = await AdminSession.findOne({ token_id: req.admin.tokenId });

    if (!session || session.expires_at < new Date()) {
      return res.status(403).json({ message: 'Session expired' });
    }

    const admin = await Admin.findById(session.admin_id);
    if (!admin) return res.status(403).json({ message: 'Invalid session' });

    await AdminSession.deleteOne({ token_id: session.token_id });

    const { token } = await generateToken(admin, req.get('User-Agent'), req.ip);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔁 Reset Password via OTP
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    await verifyOTP(email, otp, 'password_reset');
    
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    
    admin.password = newPassword; // Will be hashed by pre-save hook
    admin.last_password_change = new Date();
    admin.login_attempts = 0;
    await admin.save();

    await AdminSession.deleteMany({ admin_id: admin._id });

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// 👤 Get admin profile
exports.getAdminProfile = async (req, res) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. You are not an admin.' });
  }
  try {
    const admin = await Admin.findById(req.user.id).select('-password');
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    // Flatten and add role
    res.json({
      id: admin._id,
      email: admin.email,
      username: admin.username,
      role: 'admin'
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
