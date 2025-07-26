const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const AdminSession = require('../models/AdminSession');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const auth = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: 'No token provided.' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Invalid token format.' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Decoded token:', decoded);

    // Admin role check and session validation
    if (decoded.role === 'admin') {
      const admin = await Admin.findById(decoded.id);
      if (!admin) return res.status(401).json({ message: 'Admin not found' });

      const session = await AdminSession.findOne({
        admin_id: admin._id, 
        token_id: decoded.tokenId
      });

      if (!session || session.expires_at < new Date()) {
        return res.status(403).json({ message: 'Session expired' });
      }

      req.user = decoded;
      req.admin = admin;
      return next();
    }

    // User role
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: 'User not found' });

    req.user = decoded;
    req.userData = user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = auth;
