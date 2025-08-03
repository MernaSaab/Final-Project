/**
 * Enhanced file upload middleware with security features
 */
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

/**
 * Enhanced file filter function to validate images with additional security checks
 * - Validates file is an actual image by checking MIME type
 * - Restricts to common image formats
 * - Checks file extension matches content type
 */
const fileFilter = (req, file, cb) => {
  // List of allowed image MIME types
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  
  // List of allowed file extensions
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  
  // Get file extension
  const ext = path.extname(file.originalname).toLowerCase();
  
  // Check if MIME type is allowed
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(new Error('Invalid file type. Only JPEG, PNG, GIF and WebP images are allowed.'), false);
  }
  
  // Check if extension is allowed
  if (!allowedExtensions.includes(ext)) {
    return cb(new Error('Invalid file extension. Only .jpg, .jpeg, .png, .gif and .webp are allowed.'), false);
  }
  
  // Check if extension matches MIME type
  const validExtensionsForMime = {
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
    'image/gif': ['.gif'],
    'image/webp': ['.webp']
  };
  
  if (!validExtensionsForMime[file.mimetype].includes(ext)) {
    return cb(new Error('File extension does not match file type.'), false);
  }
  
  // All checks passed
  cb(null, true);
};

/**
 * Initialize multer with enhanced security options
 */
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
    files: 1,                  // Maximum 1 file per request
    fields: 10                 // Limit number of non-file fields
  }
});

/**
 * Helper function to generate secure image URL
 * Ensures proper URL encoding and validation
 */
const getImageUrl = (req, file) => {
  if (!file || !file.filename) {
    return null;
  }
  
  // Sanitize filename
  const sanitizedFilename = encodeURIComponent(file.filename);
  
  // Generate URL with protocol and host
  const serverUrl = `${req.protocol}://${req.get('host')}`;
  return `${serverUrl}/uploads/${sanitizedFilename}`;
};

/**
 * Helper function to safely delete old image files
 * Includes path traversal protection and validation
 */
const deleteOldImage = (oldImageUrl) => {
  if (!oldImageUrl) return false;
  
  try {
    // Extract filename from URL and decode it
    const oldImagePath = decodeURIComponent(oldImageUrl.split('/uploads/').pop());
    
    if (!oldImagePath) return false;
    
    // Prevent path traversal attacks by normalizing the path
    const normalizedPath = path.normalize(oldImagePath).replace(/^\.\.\//, '');
    const fullPath = path.join(uploadsDir, normalizedPath);
    
    // Ensure the file is within the uploads directory (prevent directory traversal)
    if (!fullPath.startsWith(uploadsDir)) {
      console.error('Security warning: Attempted path traversal detected');
      return false;
    }
    
    // Check if file exists and delete it
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      console.log(`Deleted old image: ${fullPath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error deleting old image:', error);
    return false;
  }
};

// Error handling middleware for multer
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        error: 'File too large. Maximum size is 5MB.',
        success: false 
      });
    }
    return res.status(400).json({ 
      error: err.message,
      success: false 
    });
  } else if (err) {
    return res.status(400).json({ 
      error: err.message,
      success: false 
    });
  }
  next();
};

module.exports = {
  upload,
  getImageUrl,
  deleteOldImage,
  handleUploadError
};
