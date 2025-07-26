require('dotenv').config();
const OTP = require('../models/OTP');
const nodemailer = require('nodemailer');

const OTP_CONFIG = {
  LENGTH: 6,
  EXPIRY_MINUTES: 10,
  MAX_ATTEMPTS: 3
};

// 🔐 Generate a random OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// 📩 Create OTP in DB
const createOTP = async (email, type) => {
  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + OTP_CONFIG.EXPIRY_MINUTES * 60 * 1000);

  // Store OTP in DB
  await OTP.create({
    email,
    otp,
    type,
    is_used: false,
    expires_at: expiresAt,
    attempts: 0,
    max_attempts: OTP_CONFIG.MAX_ATTEMPTS,
    created_at: new Date()
  });

  // Log the OTP for debugging
  console.log(`Generated OTP for ${email} [${type}]:`, otp);

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Welcome to Khan Trading World - Your OTP Code',
      text: `Welcome to Khan Trading World!\n\nYour OTP code for ${type} is: ${otp}\n\nThank you for joining us!`,
      html: `<h2>Welcome to Khan Trading World!</h2><p>Your OTP code for <b>${type}</b> is: <b>${otp}</b></p><p>Thank you for joining us!</p>`
    });
  } catch (err) {
    console.error('Failed to send OTP email:', err);
  }

  return otp;
};

// ✅ Verify OTP
const verifyOTP = async (email, code, type) => {
  const record = await OTP.findOne({
    email,
    otp: code,
    type,
    is_used: false
  }).sort({ created_at: -1 });

  if (!record) throw new Error('Invalid OTP');

  if (record.attempts >= record.max_attempts) {
    throw new Error('OTP attempt limit exceeded');
  }

  if (new Date(record.expires_at) < new Date()) {
    throw new Error('OTP expired');
  }

  await OTP.findByIdAndUpdate(record._id, {
    is_used: true, 
    attempts: record.attempts + 1
  });

  return true;
};

module.exports = {
  createOTP,
  verifyOTP,
  OTP_CONFIG
};
