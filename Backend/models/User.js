const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true,
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  name: { 
    type: String 
  },
  user_phone: { 
    type: String 
  },
  bank_id: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bank'
  },
  profile_id: { 
    type: mongoose.Schema.Types.ObjectId 
  },
  aadhar: { 
    type: String 
  },
  pan: { 
    type: String 
  },
  age: { 
    type: Number 
  },
  gender: { 
    type: String 
  },
  dob: { 
    type: String 
  },
  is_premium: { 
    type: Boolean, 
    default: false 
  },
  joined_whatsapp: { 
    type: Boolean, 
    default: false 
  },
  premium_expiry: { 
    type: String,
    default: null 
  },
  created_at: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: false
});

// Pre-save middleware to hash password
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
