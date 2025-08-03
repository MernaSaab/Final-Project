const multer = require("multer");
const path = require("path");
const fs = require("fs");

/**
 * Creates a multer upload middleware for a specific file type
 * @param {string} folderName - Subfolder name within uploads directory (e.g., 'meals', 'profiles')
 * @param {string[]} allowedMimeTypes - Array of allowed MIME types (e.g., ['image/jpeg', 'image/png'])
 * @param {number} maxFileSize - Maximum file size in bytes (default: 5MB)
 * @returns {object} - Multe
 * r middleware and helper functions
 */
const createUploadMiddleware = (
  folderName = "",
  allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"],
  maxFileSize = 5 * 1024 * 1024
) => {
  // Create base uploads directory if it doesn't exist
  const baseUploadsDir = path.join(__dirname, "../uploads");
  if (!fs.existsSync(baseUploadsDir)) {
    fs.mkdirSync(baseUploadsDir, { recursive: true });
  }

  // Create specific folder if provided
  const uploadsDir = folderName
    ? path.join(baseUploadsDir, folderName)
    : baseUploadsDir;
  if (folderName && !fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Configure multer storage
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      cb(null, file.fieldname + "-" + uniqueSuffix + ext);
    },
  });

  // File filter function
  const fileFilter = (req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          `Invalid file type. Allowed types: ${allowedMimeTypes.join(", ")}`
        ),
        false
      );
    }
  };

  // Initialize multer with options
  const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
      fileSize: maxFileSize,
    },
  });

  // Helper function to generate file URL
  const getFileUrl = (req, file) => {
    const serverUrl = `${req.protocol}://${req.get("host")}`;
    const relativePath = folderName
      ? `uploads/${folderName}/${file.filename}`
      : `uploads/${file.filename}`;
    return `${serverUrl}/${relativePath}`;
  };

  // Helper function to delete old file
  const deleteOldFile = (fileUrl) => {
    if (!fileUrl) return;

    try {
      // Extract filename from URL
      const urlParts = fileUrl.split("/uploads/");
      if (urlParts.length < 2) return;

      const filePath = urlParts[1];
      const fullPath = path.join(baseUploadsDir, filePath);

      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
        console.log(`Deleted old file: ${fullPath}`);
      }
    } catch (error) {
      console.error("Error deleting old file:", error);
    }
  };

  // Error handling middleware for multer
  const handleUploadError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          error: `File too large. Maximum size is ${
            maxFileSize / (1024 * 1024)
          }MB.`,
          success: false,
        });
      }
      return res.status(400).json({
        error: err.message,
        success: false,
      });
    } else if (err) {
      return res.status(400).json({
        error: err.message,
        success: false,
      });
    }
    next();
  };

  return {
    upload,
    getFileUrl,
    deleteOldFile,
    handleUploadError,
  };
};

// Create default image upload middleware
const imageUpload = createUploadMiddleware("images", [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
]);

// Create meal image upload middleware
const mealImageUpload = createUploadMiddleware("meals", [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
]);

// Create profile image upload middleware
const profileImageUpload = createUploadMiddleware("profiles", [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
]);

// Create document upload middleware
const documentUpload = createUploadMiddleware(
  "documents",
  [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  10 * 1024 * 1024
);

module.exports = {
  createUploadMiddleware,
  imageUpload,
  mealImageUpload,
  profileImageUpload,
  documentUpload,
};
