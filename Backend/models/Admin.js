
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const AdminSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  username: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    required: true 
  },
  is_email_verified: { 
    type: Boolean, 
    default: false 
  },
  login_attempts: { 
    type: Number, 
    default: 0 
  },
  lockout_until: { 
    type: Date 
  },
  last_login_at: { 
    type: Date 
  },
  last_password_change: { 
    type: Date, 
    default: Date.now 
  },
  require_password_change: { 
    type: Boolean, 
    default: false 
  },
  two_factor_enabled: { 
    type: Boolean, 
    default: false 
  },
  created_at: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: false
});

// Pre-save middleware to hash password
AdminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords
AdminSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Admin', AdminSchema);