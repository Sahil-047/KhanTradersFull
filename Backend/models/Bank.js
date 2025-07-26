const mongoose = require('mongoose');

const BankSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  account_holder_name: {
    type: String
  },
  account_number: {
    type: String
  },
  account_type: {
    type: String
  },
  bank_name: {
    type: String
  },
  branch: {
    type: String
  },
  ifsc: {
    type: String
  },
  aadhar: {
    type: String
  },
  pan: {
    type: String
  }
}, {
  timestamps: false
});

module.exports = mongoose.model('Bank', BankSchema);
