// filepath: c:\Users\mrsay\OneDrive\Desktop\KhanTraders\Backend\models\AdminSession.js
const mongoose = require('mongoose');

const AdminSessionSchema = new mongoose.Schema({
  admin_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  token_id: {
    type: String
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  expires_at: {
    type: Date
  },
  user_agent: {
    type: String
  },
  ip_address: {
    type: String
  }
}, {
  timestamps: false
});

module.exports = mongoose.model('AdminSession', AdminSessionSchema);