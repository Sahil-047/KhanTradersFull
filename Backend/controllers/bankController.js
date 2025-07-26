const Bank = require('../models/Bank');
const User = require('../models/User');

// 🏦 Create a bank record with user identity validation
exports.createBank = async (req, res) => {
  try {
    const userId = req.body.user_id || req.user.id;
    const { account_holder_name, account_number, account_type, bank_name, branch, ifsc, aadhar, pan } = req.body;
    
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Check if aadhar or pan is already linked to another user
    if (aadhar) {
      const existingAadhar = await Bank.findOne({ aadhar, user_id: { $ne: userId } });
      if (existingAadhar) {
        return res.status(400).json({ error: 'Aadhar is already linked to another user.' });
      }
    }
    
    if (pan) {
      const existingPan = await Bank.findOne({ pan, user_id: { $ne: userId } });
      if (existingPan) {
        return res.status(400).json({ error: 'PAN is already linked to another user.' });
      }
    }

    // Identity validation (enforced)
    if (
      (aadhar && aadhar !== user.aadhar) ||
      (pan && pan !== user.pan) 
      ||
      (account_holder_name && account_holder_name !== user.name)
    ) {
      return res.status(400).json({ error: 'Bank account details do not match user identity.' });
    }

    // Create the bank record
    const bank = await Bank.create({
      user_id: userId,
      account_holder_name,
      account_number,
      account_type,
      bank_name,
      branch,
      ifsc,
      aadhar,
      pan
    });

    // Link the user to this bank (set user.bank_id = bank._id)
    await User.findByIdAndUpdate(userId, { bank_id: bank._id });

    res.status(201).json(bank);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

// 📄 Get all bank records
exports.getBanks = async (req, res) => {
  try {
    const banks = await Bank.find();
    res.json(banks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔍 Get a single bank record
exports.getBankById = async (req, res) => {
  try {
    const bank = await Bank.findById(req.params.id);
    if (!bank) return res.status(404).json({ error: 'Bank not found' });
    res.json(bank);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✏️ Update a bank record
exports.updateBank = async (req, res) => {
  try {
    const bankId = req.params.id;
    const { account_holder_name, account_number, account_type, bank_name, branch, ifsc, aadhar, pan } = req.body;

    const updatedBank = await Bank.findByIdAndUpdate(
      bankId,
      {
        $set: {
          account_holder_name,
          account_number,
          account_type,
          bank_name,
          branch,
          ifsc,
          aadhar,
          pan
        }
      },
      { new: true, runValidators: true }
    );
    
    if (!updatedBank) return res.status(404).json({ error: 'Bank not found' });
    res.json(updatedBank);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ❌ Delete a bank record
exports.deleteBank = async (req, res) => {
  try {
    const deleted = await Bank.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Bank not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔁 Get all banks for a given user
exports.getBanksByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const banks = await Bank.find({ user_id: userId });
    res.json(banks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
