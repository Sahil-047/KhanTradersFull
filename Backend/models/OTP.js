const mongoose = require('mongoose');

const OTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  otp: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['login', 'registration', 'password_reset']
  },
  is_used: {
    type: Boolean,
    default: false
  },
  expires_at: {
    type: Date,
    required: true
  },
  attempts: {
    type: Number,
    default: 0
  },
  max_attempts: {
    type: Number,
    default: 3
  },
  created_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: false
});

module.exports = mongoose.model('OTP', OTPSchema);
