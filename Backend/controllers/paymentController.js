const Payment = require('../models/Payment');
const User = require('../models/User');

// 🧾 Create a new payment
exports.createPayment = async (req, res) => {
  try {
    const payment = await Payment.create(req.body);
    res.status(201).json(payment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 📋 Get all payments for a user with filters (status, date range)
exports.getPaymentsByUser = async (req, res) => {
  try {
    const { status, from, to } = req.query;
    const userId = req.params.userId;

    const filterQuery = { user_id: userId };

    if (status) filterQuery.status = status;
    
    if (from || to) {
      filterQuery.date = {};
      if (from) filterQuery.date.$gte = new Date(from);
      if (to) filterQuery.date.$lte = new Date(to);
    }

    const payments = await Payment.find(filterQuery)
      .sort({ date: -1 })
      .populate({
        path: 'user_id',
        select: 'name',
        model: User
      });

    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✏️ Update a payment
exports.updatePayment = async (req, res) => {
  try {
    const updatedPayment = await Payment.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedPayment) return res.status(404).json({ error: 'Payment not found' });
    res.json(updatedPayment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ❌ Delete a payment
exports.deletePayment = async (req, res) => {
  try {
    const deleted = await Payment.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Payment not found' });
    res.json({ message: 'Payment deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
