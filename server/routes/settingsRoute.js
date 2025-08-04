const express = require("express");
const router = express.Router();
const db = require("../dbSingleton").getConnection();
const { verifyToken, isAdmin } = require("../middleware/auth");

// Initialize system settings table if it doesn't exist
const initializeSettingsTable = () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS system_settings (
      id INT PRIMARY KEY AUTO_INCREMENT,
      setting_name VARCHAR(50) UNIQUE NOT NULL,
      setting_value DECIMAL(10,4) NOT NULL,
      description VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `;

  db.query(createTableQuery, (err) => {
    if (err) {
      console.error("Error creating system_settings table:", err);
      return;
    }
    
    // Insert default VAT rate if it doesn't exist
    const insertDefaultVAT = `
      INSERT IGNORE INTO system_settings (setting_name, setting_value, description) 
      VALUES ('vat_rate', 0.1700, 'VAT rate for food products in Israel (17%)')
    `;
    
    db.query(insertDefaultVAT, (err) => {
      if (err) {
        console.error("Error inserting default VAT rate:", err);
      } else {
        console.log("System settings table initialized with default VAT rate");
      }
    });
  });
};

// Initialize table on module load
initializeSettingsTable();

/**
 * @route   GET /settings
 * @desc    Get all system settings
 * @access  Admin only
 */
router.get("/", verifyToken, isAdmin, (req, res) => {
  const query = "SELECT * FROM system_settings ORDER BY setting_name";
  
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error getting system settings:", err);
      return res.status(500).json({ message: "Error getting system settings", error: err.message });
    }
    res.json(results);
  });
});

/**
 * @route   GET /settings/:name
 * @desc    Get specific setting by name
 * @access  Public (for VAT rate)
 */
router.get("/:name", (req, res) => {
  const { name } = req.params;
  const query = "SELECT * FROM system_settings WHERE setting_name = ?";
  
  db.query(query, [name], (err, results) => {
    if (err) {
      console.error("Error getting setting:", err);
      return res.status(500).json({ message: "Error getting setting", error: err.message });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ message: "Setting not found" });
    }
    
    res.json(results[0]);
  });
});

/**
 * @route   PUT /settings/:name
 * @desc    Update specific setting
 * @access  Admin only
 */
router.put("/:name", verifyToken, isAdmin, (req, res) => {
  const { name } = req.params;
  const { setting_value, description } = req.body;
  
  if (setting_value === undefined) {
    return res.status(400).json({ message: "setting_value is required" });
  }
  
  const query = `
    UPDATE system_settings 
    SET setting_value = ?, description = COALESCE(?, description), updated_at = CURRENT_TIMESTAMP
    WHERE setting_name = ?
  `;
  
  db.query(query, [setting_value, description, name], (err, results) => {
    if (err) {
      console.error("Error updating setting:", err);
      return res.status(500).json({ message: "Error updating setting", error: err.message });
    }
    
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Setting not found" });
    }
    
    res.json({ 
      message: "Setting updated successfully",
      setting_name: name,
      setting_value: setting_value
    });
  });
});

/**
 * @route   POST /settings
 * @desc    Create new setting
 * @access  Admin only
 */
router.post("/", verifyToken, isAdmin, (req, res) => {
  const { setting_name, setting_value, description } = req.body;
  
  if (!setting_name || setting_value === undefined) {
    return res.status(400).json({ message: "setting_name and setting_value are required" });
  }
  
  const query = `
    INSERT INTO system_settings (setting_name, setting_value, description) 
    VALUES (?, ?, ?)
  `;
  
  db.query(query, [setting_name, setting_value, description], (err, results) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ message: "Setting already exists" });
      }
      console.error("Error creating setting:", err);
      return res.status(500).json({ message: "Error creating setting", error: err.message });
    }
    
    res.status(201).json({ 
      message: "Setting created successfully",
      id: results.insertId,
      setting_name: setting_name,
      setting_value: setting_value
    });
  });
});

module.exports = router;