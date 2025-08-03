/**
 * Authentication middleware for protecting API routes
 */
const jwt = require("jsonwebtoken");
const dbSingleton = require("../dbSingleton");

// Secret key for JWT signing - in production, store this in environment variables
const JWT_SECRET = "healthylifestyle_jwt_secret";

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  // Get token from Authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "אין הרשאה: לא סופק טוקן אימות",
    });
  }

  // Extract token from header
  // חותך ומבודד את התוכן
  const token = authHeader.split(" ")[1];

  try {
    //מאמת ופורס את האסימון.
    const decoded = jwt.verify(token, JWT_SECRET);

    //שומר את הנתונים ב-req.user
    req.user = decoded;
    //אם הכול תקין.
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "אין הרשאה: טוקן לא תקין או פג תוקף",
    });
  }
};

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  // First verify the token
  verifyToken(req, res, () => {
    // Check if user is admin
    if (req.user && req.user.user_type === "admin") {
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: "אין הרשאה: נדרשות הרשאות מנהל",
      });
    }
  });
};

// Generate JWT token for user
const generateToken = (user) => {
  const userData = {
    user_id: user.user_id.toString(), // Ensure user_id is a string
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    user_type: user.user_type,
  };
  return jwt.sign(userData, JWT_SECRET, { expiresIn: "24h" });
};

module.exports = {
  verifyToken,
  isAdmin,
  generateToken,
};
