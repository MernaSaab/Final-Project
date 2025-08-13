
const express = require("express");
const router = express.Router();
const db = require("../dbSingleton").getConnection();
const jwt = require('jsonwebtoken'); // Make sure jwt is installed

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers['authorization'];
  
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');
    const token = bearer[1];
    req.token = token;
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
      req.user = decoded;
      next();
    } catch (err) {
      console.error('Token verification failed:', err);
      res.status(403).json({ message: 'Invalid or expired token' });
    }
  } else {
    console.log('No token provided');
    // For development, continue without token
    next();
    // In production, uncomment the line below instead
    // res.status(403).json({ message: 'No token provided' });
  }
};

// Create order with items in one atomic call BEFORE dynamic routes to avoid /:id collision
router.post("/full", verifyToken, async (req, res) => {
  console.log("Received full order request with payload:", JSON.stringify(req.body));
  console.log("/order_meal/full body:", JSON.stringify(req.body, null, 2));
  console.log("/order_meal/full headers:", JSON.stringify(req.headers, null, 2));
  
  // Accept either 'meals' (legacy) or 'items' (frontend payload) for flexibility
  const { user_id, status, meals, items, first_name, last_name, phone, email, id_number, address } = req.body;
  const list = meals || items;

  if (!user_id || !Array.isArray(list) || list.length === 0) {
    return res.status(400).json({ message: "Missing user_id or meals/items" });
  }

  // Start a transaction to ensure data consistency
  db.beginTransaction(async (err) => {
    if (err) {
      console.error("Transaction begin error:", err);
      return res.status(500).json({ message: "Database transaction error", error: err });
    }

    try {
      // Step 1: Create the order
      const order_date = new Date().toISOString().split("T")[0];
      const insertOrderQuery = "INSERT INTO orders (order_date, status, user_id, first_name, last_name, phone, email, id_number, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
      
      const orderResult = await new Promise((resolve, reject) => {
        db.query(insertOrderQuery, [order_date, status, user_id, first_name || null, last_name || null, phone || null, email || null, id_number || null, address || null], (err, result) => {
          if (err) {
            return reject(err);
          }
          resolve(result);
        });
      });
      
      const orderId = orderResult.insertId;
      console.log(`Created order with ID: ${orderId}`);

      // Step 2: Insert order items
      const insertItemsQuery = "INSERT INTO order_meal (order_id, meal_id, quantity) VALUES ?";
      const values = list.map((m) => [
        orderId,
        m.meal_id || m.mealId || m.id,
        m.quantity || m.qty,
      ]);

      await new Promise((resolve, reject) => {
        db.query(insertItemsQuery, [values], (err) => {
          if (err) {
            return reject(err);
          }
          resolve();
        });
      });
      
      console.log(`Added ${values.length} items to order ${orderId}`);

      // Step 3: Update meal quantities
      console.log('Items to update quantities for:', JSON.stringify(list, null, 2));
      
      // Process each meal item and update its quantity
      for (const item of list) {
        const mealId = item.meal_id || item.mealId || item.id;
        const quantity = item.quantity || item.qty;
        
        console.log(`Processing meal ID: ${mealId} with quantity: ${quantity}`);
        
        // Check if meal exists and get current quantity
        const checkResults = await new Promise((resolve, reject) => {
          db.query("SELECT * FROM meals WHERE meal_id = ?", [mealId], (err, results) => {
            if (err) return reject(err);
            resolve(results);
          });
        });
        
        if (checkResults.length === 0) {
          console.error(`Meal with ID ${mealId} not found in database`);
          continue; // Skip this item but don't fail the transaction
        }
        
        console.log(`Found meal: ${checkResults[0].meal_name} with current quantity: ${checkResults[0].quantity}`);
        
        // DIRECT CHECK: Log the raw meal data from database
        console.log('Raw meal data from DB:', JSON.stringify(checkResults[0]));
        
        // Calculate new quantity directly to ensure it works
        const currentQuantity = parseInt(checkResults[0].quantity) || 0;
        const orderQuantity = parseInt(quantity) || 0;
        const newQuantity = Math.max(0, currentQuantity - orderQuantity);
        
        console.log(`QUANTITY CALCULATION: ${currentQuantity} - ${orderQuantity} = ${newQuantity}`);
        
        // Update using direct value instead of GREATEST function
        const updateQuery = "UPDATE meals SET quantity = ? WHERE meal_id = ?";
        
        console.log(`Executing query: ${updateQuery} with params [${newQuantity}, ${mealId}]`);
        
        const updateResult = await new Promise((resolve, reject) => {
          db.query(updateQuery, [newQuantity, mealId], (err, result) => {
            if (err) return reject(err);
            resolve(result);
          });
        });
        
        console.log(`Update result for meal ID ${mealId}:`, updateResult);
        console.log(`Affected rows: ${updateResult.affectedRows}`);
        
        // Verify the update with a direct select
        const verifyResults = await new Promise((resolve, reject) => {
          db.query("SELECT meal_id, meal_name, quantity FROM meals WHERE meal_id = ?", [mealId], (err, results) => {
            if (err) return reject(err);
            resolve(results);
          });
        });
        
        if (verifyResults.length > 0) {
          console.log(`New quantity for meal ${verifyResults[0].meal_name} (ID: ${mealId}): ${verifyResults[0].quantity}`);
          console.log('VERIFICATION: Raw updated meal data:', JSON.stringify(verifyResults[0]));
        }
      }
      
      // Log final state of all affected meals
      const mealIds = list.map(item => item.meal_id || item.mealId || item.id);
      if (mealIds.length > 0) {
        const finalResults = await new Promise((resolve, reject) => {
          db.query("SELECT meal_id, meal_name, quantity FROM meals WHERE meal_id IN (?)", [mealIds], (err, results) => {
            if (err) return reject(err);
            resolve(results);
          });
        });
        
        console.log("Final state of affected meals:", finalResults);
      }
      
      // Commit the transaction
      await new Promise((resolve, reject) => {
        db.commit((err) => {
          if (err) return reject(err);
          resolve();
        });
      });
      
      console.log('Transaction committed successfully');
      res.json({ message: "Order and items created successfully, meal quantities updated", orderId });
      
    } catch (error) {
      // Rollback on any error
      db.rollback(() => {
        console.error("Error in transaction:", error);
        console.error("Error stack:", error.stack);
        res.status(500).json({ message: "Error processing order", error: error.message });
      });
    }
  });
});

// Get all
router.get("/", (req, res) => {
  db.query("SELECT * FROM order_meal", (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Get by ID
router.get("/:id", (req, res) => {
  db.query("SELECT * FROM order_meal WHERE order_id = ?", [req.params.id], (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length === 0) return res.status(404).send("order_meal not found");
    res.json(results[0]);
  });
});

// Create
router.post("/", (req, res) => {
  const query = "INSERT INTO order_meal (order_id, meal_id, quantity) VALUES (?, ?, ?)";
  db.query(query, [req.body.order_id, req.body.meal_id, req.body.quantity], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json({ message: "order_meal created", id: results.insertId });
  });
});

// Update
router.put("/:id", (req, res) => {
  const query = "UPDATE order_meal SET meal_id=?, quantity=? WHERE order_id=?";
  db.query(query, [req.body.meal_id, req.body.quantity, req.params.id], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json({ message: "order_meal updated" });
  });
});

// Delete
router.delete("/:id", (req, res) => {
  db.query("DELETE FROM order_meal WHERE order_id=?", [req.params.id], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json({ message: "order_meal deleted" });
  });
});

module.exports = router;
