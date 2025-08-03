/**
 * Authentication middleware for JWT token verification
 */
const jwt = require('jsonwebtoken');

// Secret key for JWT - in production this should be in environment variables
const JWT_SECRET = 'your_jwt_secret_key'; // TODO: Move to environment variable

/**
 * Middleware to authenticate JWT token
 * Verifies the token from Authorization header and adds user data to request
 */
const authenticateToken = (req, res, next) => {
  // Get auth header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN format
  
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Access denied. No token provided.' 
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Add user data to request
    req.user = decoded;
    
    // Continue to next middleware
    next();
  } catch (error) {
    console.error('Token verification error:', error.message);
    return res.status(403).json({ 
      success: false, 
      message: 'Invalid or expired token' 
    });
  }
};

module.exports = { authenticateToken, JWT_SECRET };
