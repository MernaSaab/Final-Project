/**
 * Global error handling middleware
 */

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  
  // Default error status and message
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  
  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = err.message;
  } else if (err.name === 'UnauthorizedError') {
    statusCode = 401;
    message = 'Unauthorized: Invalid or missing authentication token';
  } else if (err.name === 'ForbiddenError') {
    statusCode = 403;
    message = 'Forbidden: You do not have permission to access this resource';
  } else if (err.name === 'NotFoundError') {
    statusCode = 404;
    message = err.message || 'Resource not found';
  }
  
  // Send error response
  res.status(statusCode).json({
    success: false,
    error: message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

// Not found middleware for undefined routes
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  error.name = 'NotFoundError';
  next(error);
};

module.exports = {
  errorHandler,
  notFound
};
