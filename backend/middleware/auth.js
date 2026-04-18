// middleware/auth.js — JWT Authentication Guard
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized. No token.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({ success: false, message: 'User not found.' });
    }

    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token invalid or expired.' });
  }
};

const requirePremium = (req, res, next) => {
  if (req.user.subscription.plan === 'free') {
    return res.status(403).json({
      success: false,
      message: 'This feature requires a Premium subscription.',
      upgradeRequired: true,
    });
  }
  next();
};

module.exports = { protect, requirePremium };
