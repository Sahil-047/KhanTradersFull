const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); // MongoDB connection

dotenv.config();

// Connect to MongoDB
connectDB()
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Import route files
const userRoutes = require('./routes/userRoutes');
const bankRoutes = require('./routes/bankRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/authRoutes');
const contactRoutes = require('./routes/contact');

// Public Routes
app.use('/api/user', userRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);

// Password reset routes
app.post('/forgot-password', require('./controllers/userController').requestPasswordResetOTP);
app.post('/verify-reset-otp', require('./controllers/userController').verifyPasswordResetOTP);
app.post('/reset-password', require('./controllers/userController').resetPasswordWithOTP);

// Protected routes - apply auth middleware
const auth = require('./middleware/auth');
app.use('/api/banks', auth, bankRoutes);
app.use('/api/payments', auth, paymentRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

// Start server only if this file is run directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

module.exports = app;
