/**
 * Middleware to check if the user is an admin
 * This middleware should be used after authenticateToken middleware
 */
const isAdmin = (req, res, next) => {
  // Check if user exists and has admin role
  if (!req.user || req.user.user_type !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied: Admin privileges required",
    });
  }

  // User is admin, proceed to next middleware
  next();
};

module.exports = { isAdmin };
