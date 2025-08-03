/**
 * Combined middleware for meal image uploads with admin authorization
 * This middleware combines authentication, admin role verification, and file upload handling
 */
const { upload, getImageUrl, deleteOldImage, handleUploadError } = require('./upload');
const { authenticateToken } = require('./authMiddleware');
const { isAdmin } = require('./adminMiddleware');
const express = require('express');

/**
 * Creates a middleware chain for handling meal image uploads with admin authorization
 * @returns {Array} Array of middleware functions
 */
const createMealImageUploadMiddleware = () => {
  const router = express.Router();
  
  // Apply authentication and admin check before handling file upload
  return [
    authenticateToken,
    isAdmin,
    upload.single('image'),
    handleUploadError
  ];
};

/**
 * Middleware for handling meal image uploads with proper admin authorization
 */
const securedMealImageUpload = {
  middleware: createMealImageUploadMiddleware(),
  getImageUrl,
  deleteOldImage,
  handleUploadError
};

module.exports = securedMealImageUpload;
