const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Auth Middleware — protect
 * Verifies the JWT token from the Authorization header.
 * Attaches the authenticated user object to req.user.
 */
const protect = async (req, res, next) => {
  let token;

  // Expect: "Authorization: Bearer <token>"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.',
    });
  }

  try {
    // Verify the token and decode the payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach live user data (without password) to request
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User associated with this token no longer exists.',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token.',
    });
  }
};

module.exports = { protect };
