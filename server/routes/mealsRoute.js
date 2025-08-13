
const express = require("express");
const router = express.Router();
const db = require("../dbSingleton").getConnection();
const path = require("path");
const fs = require("fs");
const { verifyToken, isAdmin } = require("../middleware/auth");
const { mealImageUpload } = require('../middleware/fileUpload');

// Extract middleware components
const upload = mealImageUpload.upload;
const getImageUrl = mealImageUpload.getFileUrl;
const deleteOldImage = mealImageUpload.deleteOldFile;
const handleUploadError = mealImageUpload.handleUploadError;

// Get all
router.get("/", (req, res) => {
  db.query("SELECT * FROM meals", (err, results) => {
    if (err) return res.status(500).send(err);
    
    // Transform results to include full image URLs
    const mealsWithUrls = results.map(meal => {
      if (meal.image_url) {
        // Construct full URL from filename
        const serverUrl = `${req.protocol}://${req.get('host')}`;
        meal.image_url = `${serverUrl}/uploads/meals/${meal.image_url}`;
      }
      return meal;
    });
    
    res.json(mealsWithUrls);
  });
});

/**
 * @route   POST /meals/refresh-quantities
 * @desc    Force update meal quantities directly
 * @access  Public
 */
router.post("/refresh-quantities", (req, res) => {
  console.log("REFRESH QUANTITIES ENDPOINT CALLED");
  console.log("Request body:", req.body);
  
  const { items } = req.body;
  
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "Missing or invalid items array" });
  }
  
  // Process each item and update quantity directly
  const updatePromises = items.map(item => {
    return new Promise((resolve, reject) => {
      const mealId = item.meal_id || item.id;
      const quantity = item.quantity || item.qty;
      
      if (!mealId || !quantity) {
        console.log("Skipping item with missing meal_id or quantity:", item);
        return resolve();
      }
      
      console.log(`Directly updating meal ${mealId} quantity by -${quantity}`);
      
      // First get current quantity
      db.query("SELECT quantity FROM meals WHERE meal_id = ?", [mealId], (err, results) => {
        if (err) {
          console.error(`Error getting current quantity for meal ${mealId}:`, err);
          return reject(err);
        }
        
        if (results.length === 0) {
          console.error(`Meal with ID ${mealId} not found`);
          return resolve(); // Skip but don't fail
        }
        
        const currentQuantity = results[0].quantity || 0;
        const newQuantity = Math.max(0, currentQuantity - quantity);
        
        console.log(`Meal ${mealId}: ${currentQuantity} - ${quantity} = ${newQuantity}`);
        
        // Update with new quantity
        db.query("UPDATE meals SET quantity = ? WHERE meal_id = ?", [newQuantity, mealId], (updateErr, updateResult) => {
          if (updateErr) {
            console.error(`Error updating meal ${mealId}:`, updateErr);
            return reject(updateErr);
          }
          
          console.log(`Updated meal ${mealId} quantity to ${newQuantity}, affected rows: ${updateResult.affectedRows}`);
          resolve(updateResult);
        });
      });
    });
  });
  
  // Wait for all updates to complete
  Promise.all(updatePromises)
    .then(() => {
      console.log("All meal quantities refreshed successfully");
      res.json({ message: "Meal quantities refreshed successfully" });
    })
    .catch(error => {
      console.error("Error refreshing meal quantities:", error);
      res.status(500).json({ message: "Error refreshing meal quantities", error: error.message });
    });
});

/**
 * @route   GET /meals/count
 * @desc    Get the total count of meals
 * @access  Public
 */
router.get("/count", (req, res) => {
  const query = "SELECT COUNT(*) as count FROM meals";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error getting meal count:", err);
      return res.status(500).json({ message: "Error getting meal count", error: err.message });
    }
    res.json({ count: results[0].count });
  });
});

// Get by ID
router.get("/:id", (req, res) => {
  db.query("SELECT * FROM meals WHERE meal_id = ?", [req.params.id], (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length === 0) return res.status(404).send("Meal not found");
    
    // Transform result to include full image URL
    const meal = results[0];
    if (meal.image_url) {
      // Construct full URL from filename
      const serverUrl = `${req.protocol}://${req.get('host')}`;
      meal.image_url = `${serverUrl}/uploads/meals/${meal.image_url}`;
    }
    
    res.json(meal);
  });
});

/**
 * @route   POST /meals
 * @desc    Create a new meal with image upload
 * @access  Admin only
 */
router.post("/", verifyToken, isAdmin, upload.single('image'), handleUploadError, (req, res) => {
  try {
    console.log('POST /meals - Request body:', req.body);
    console.log('POST /meals - File:', req.file);
    
    // Get form data
    const { meal_name, description, price, quantity, calories } = req.body;
    
    // Log received data
    console.log('Received meal data:', { meal_name, description, price, quantity, calories });
    
    // Validate required fields
    if (!meal_name || !price) {
      console.error('Missing required fields:', { meal_name, price });
      return res.status(400).json({ 
        error: 'Missing required fields: meal_name and price are required', 
        success: false 
      });
    }
    
    // Validate quantity is at least 1
    if (quantity !== undefined && (isNaN(parseInt(quantity)) || parseInt(quantity) < 1)) {
      console.error('Invalid quantity value:', quantity);
      return res.status(400).json({ 
        error: 'Quantity must be at least 1', 
        success: false 
      });
    }
    
    // Generate image filename if file was uploaded
    let image_url = req.body.image_url; // Default to provided URL if no file
    
    if (req.file) {
      // If file was uploaded, just store the filename
      console.log('Using filename from uploaded file');
      image_url = req.file.filename;
      console.log('Using image filename:', image_url);
      
      // Verify the file was saved correctly
      const filePath = path.join(__dirname, '../uploads/meals', image_url);
      if (!fs.existsSync(filePath)) {
        console.error('File was not saved correctly:', filePath);
        return res.status(500).json({ 
          error: 'File upload failed - file not saved correctly', 
          success: false 
        });
      }
      console.log('File verified at path:', filePath);
    }
    
    const query = "INSERT INTO meals (meal_name, description, image_url, price, quantity, calories) VALUES (?, ?, ?, ?, ?, ?)";
    console.log('Executing query with values:', [meal_name, description, image_url, price, quantity, calories || 0]);
    
    db.query(query, [meal_name, description, image_url, price, quantity, calories || 0], (err, results) => {
      if (err) {
        console.error('Database error when inserting meal:', err);
        
        // Check for duplicate entry error
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(409).json({ 
            error: 'A meal with this ID already exists', 
            success: false,
            code: err.code
          });
        }
        
        // Check for foreign key constraint error
        if (err.code === 'ER_NO_REFERENCED_ROW') {
          return res.status(400).json({ 
            error: 'Referenced category does not exist', 
            success: false,
            code: err.code
          });
        }
        
        return res.status(500).json({ 
          error: err.message, 
          success: false,
          code: err.code || 'UNKNOWN_ERROR'
        });
      }
      console.log('Meal created successfully:', results);
      
      // Construct full URL for the response
      let fullImageUrl = image_url;
      if (req.file) {
        const serverUrl = `${req.protocol}://${req.get('host')}`;
        fullImageUrl = `${serverUrl}/uploads/meals/${image_url}`;
      }
      
      res.status(201).json({ 
        message: "Meal created successfully", 
        id: results.insertId,
        image_url: fullImageUrl,
        success: true
      });
    });
  } catch (error) {
    console.error('Exception in POST /meals route:', error);
    res.status(500).json({ error: error.message, success: false });
  }
});

/**
 * @route   PUT /meals/:id
 * @desc    Update a meal with image upload
 * @access  Admin only
 */
router.put("/:id", verifyToken, isAdmin, upload.single('image'), handleUploadError, (req, res) => {
  try {
    // Get form data
    const { meal_name, description, price, quantity, calories } = req.body;
    
    // Generate image filename if file was uploaded
    let image_url = req.body.image_url; // Default to provided URL if no file
    
    if (req.file) {
      // If file was uploaded, just store the filename
      console.log('Using filename from uploaded file for update');
      image_url = req.file.filename;
      console.log('Using image filename for update:', image_url);
      
      // If updating an image, try to delete the old image file if it exists in our uploads folder
      if (req.body.old_image_url) {
        console.log('Deleting old image:', req.body.old_image_url);
        // Extract just the filename if it's a full URL
        const oldFilename = req.body.old_image_url.includes('/') ? 
          req.body.old_image_url.split('/').pop() : req.body.old_image_url;
        
        const fullPath = path.join(__dirname, '../uploads/meals', oldFilename);
        
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
          console.log(`Deleted old file: ${fullPath}`);
        }
      }
    }
    
    const query = "UPDATE meals SET meal_name=?, description=?, image_url=?, price=?, quantity=?, calories=? WHERE meal_id=?";
    db.query(query, [meal_name, description, image_url, price, quantity, calories || 0, req.params.id], (err, results) => {
      if (err) return res.status(500).json({ error: err.message, success: false });
      
      // Construct full URL for the response
      let fullImageUrl = image_url;
      if (req.file) {
        const serverUrl = `${req.protocol}://${req.get('host')}`;
        fullImageUrl = `${serverUrl}/uploads/meals/${image_url}`;
      }
      
      console.log('Meal updated successfully with image:', fullImageUrl);
      res.json({ 
        message: "Meal updated successfully", 
        image_url: fullImageUrl,
        success: true
      });
    });
  } catch (error) {
    res.status(500).json({ error: error.message, success: false });
  }
});

/**
 * @route   DELETE /meals/:id
 * @desc    Delete a meal and its image
 * @access  Admin only
 */
router.delete("/:id", verifyToken, isAdmin, (req, res) => {
  // First get the meal to find the image URL
  db.query("SELECT image_url FROM meals WHERE meal_id=?", [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message, success: false });
    
    // If meal exists and has an image, delete the image file
    if (results.length > 0 && results[0].image_url) {
      console.log('Deleting image for meal:', results[0].image_url);
      
      // Extract just the filename if it's a full URL
      const imageUrl = results[0].image_url;
      const filename = imageUrl.includes('/') ? imageUrl.split('/').pop() : imageUrl;
      
      const fullPath = path.join(__dirname, '../uploads/meals', filename);
      
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
        console.log(`Deleted file: ${fullPath}`);
      }
    }
    
    // First delete any related category_meal entries
    db.query("DELETE FROM category_meal WHERE meal_id=?", [req.params.id], (categoryErr) => {
      if (categoryErr) {
        console.error('Error deleting category_meal entries:', categoryErr);
        // Continue anyway to try deleting the meal
      }
      
      // Then delete any related order_meal entries
      db.query("DELETE FROM order_meal WHERE meal_id=?", [req.params.id], (orderMealErr) => {
        if (orderMealErr) {
          console.error('Error deleting order_meal entries:', orderMealErr);
          // Continue anyway to try deleting the meal
        }
        
        // Finally delete the meal from database
        db.query("DELETE FROM meals WHERE meal_id=?", [req.params.id], (err, deleteResults) => {
          if (err) return res.status(500).json({ error: err.message, success: false });
          res.json({ 
            message: "Meal deleted successfully",
            success: true
          });
        });
      });
    });
  });
});

module.exports = router;
