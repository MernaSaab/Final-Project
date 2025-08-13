const express = require("express");
const router = express.Router();
const db = require("../dbSingleton").getConnection();
const { verifyToken, isAdmin } = require("../middleware/auth");

// Get all
router.get("/", (req, res) => {
  db.query("SELECT * FROM orders", (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

/**
 * @route   GET /orders/count
 * @desc    Get the total count of orders
 * @access  Admin only
 */
router.get("/count", verifyToken, isAdmin, (req, res) => {
  const query = "SELECT COUNT(*) as count FROM orders";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error getting order count:", err);
      return res.status(500).json({ message: "Error getting order count", error: err.message });
    }
    res.json({ count: results[0].count });
  });
});

// Get all orders (needs to be before :id to avoid capture)
router.get("/all", (req, res) => {
  const sql = `
    SELECT o.order_id, o.order_date, o.status,
           o.first_name, o.last_name,
           GROUP_CONCAT(CONCAT(m.meal_name, ' x ', om.quantity) SEPARATOR ', ') AS items
    FROM orders o
    LEFT JOIN order_meal om ON o.order_id = om.order_id
    LEFT JOIN meals m ON om.meal_id = m.meal_id
    GROUP BY o.order_id
    ORDER BY o.order_id DESC`;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Get orders for specific user (before dynamic :id)
router.get("/user/:id", (req, res) => {
  const userId = req.params.id.startsWith('u') ? req.params.id : 'u' + req.params.id;
  const sql = `
    SELECT o.order_id, o.order_date, o.status,
           GROUP_CONCAT(CONCAT(m.meal_name, ' x ', om.quantity) SEPARATOR ', ') AS items
    FROM orders o
    LEFT JOIN order_meal om ON o.order_id = om.order_id
    LEFT JOIN meals m ON om.meal_id = m.meal_id
    WHERE o.user_id = ?
    GROUP BY o.order_id
    ORDER BY o.order_id DESC`;
  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Get single order by ID (for receipt)
router.get("/:id", (req, res) => {
  const orderId = req.params.id;
  const query = `
    SELECT o.*, u.first_name, u.last_name, u.email, u.phone, u.address, u.id_number
    FROM orders o
    LEFT JOIN users u ON o.user_id = u.id
    WHERE o.order_id = ?
  `;
  
  db.query(query, [orderId], (err, results) => {
    if (err) {
      console.error("Error fetching order:", err);
      return res.status(500).json({ message: "Error fetching order", error: err.message });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    res.json(results[0]);
  });
});

// Get order items by order ID (for receipt)
router.get("/:id/items", (req, res) => {
  const orderId = req.params.id;
  const query = `
    SELECT om.*, m.name as meal_name, m.price, m.image_url
    FROM order_meal om
    LEFT JOIN meals m ON om.meal_id = m.id
    WHERE om.order_id = ?
  `;
  
  db.query(query, [orderId], (err, results) => {
    if (err) {
      console.error("Error fetching order items:", err);
      return res.status(500).json({ message: "Error fetching order items", error: err.message });
    }
    
    res.json(results);
  });
});

// Get by ID
router.get("/details/:id", (req, res) => {
  db.query("SELECT * FROM orders WHERE order_id = ?", [req.params.id], (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length === 0) return res.status(404).send("orders not found");
    res.json(results[0]);
  });
});

// Create
router.post('/', (req, res) => {
  const {
    firstName,
    lastName,
    phone,
    email,
    idNumber,
    address,
    cartItems,
    paymentDetails
  } = req.body;

  const orderDate = new Date().toISOString().split('T')[0];
  const status = 'pending';

  // Start a database transaction to ensure data consistency
  db.beginTransaction(err => {
    if (err) {
      console.error('Error starting transaction:', err);
      return res.status(500).json({ error: 'Error starting transaction' });
    }

    const sqlOrder = `
      INSERT INTO orders (order_date, status, first_name, last_name, phone, email, id_number, address)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sqlOrder, [orderDate, status, firstName, lastName, phone, email, idNumber, address], (err, result) => {
      if (err) {
        console.error('Error inserting order:', err);
        return db.rollback(() => {
          res.status(500).json({ error: 'Error creating order' });
        });
      }

      const orderId = result.insertId;
      const orderMeals = cartItems.map(item => [
        orderId,
        item.mealId || item.id || item.meal_id,
        item.quantity || item.qty
      ]);

      // Insert order items
      const sqlOrderMeal = `
        INSERT INTO order_meal (order_id, meal_id, quantity)
        VALUES ?
      `;

      db.query(sqlOrderMeal, [orderMeals], (err2) => {
        if (err2) {
          console.error('Error inserting order items:', err2);
          return db.rollback(() => {
            res.status(500).json({ error: 'Error creating order items' });
          });
        }

        // Update meal quantities for each ordered item
        const updatePromises = cartItems.map(item => {
          return new Promise((resolve, reject) => {
            const mealId = item.mealId || item.id || item.meal_id;
            const quantity = item.quantity || item.qty;
            
            const updateQuery = `
              UPDATE meals 
              SET quantity = GREATEST(0, quantity - ?) 
              WHERE meal_id = ?
            `;
            
            db.query(updateQuery, [quantity, mealId], (updateErr) => {
              if (updateErr) {
                console.error(`Error updating quantity for meal ${mealId}:`, updateErr);
                reject(updateErr);
              } else {
                console.log(`Updated quantity for meal ${mealId}, decreased by ${quantity}`);
                resolve();
              }
            });
          });
        });

        // Wait for all quantity updates to complete
        Promise.all(updatePromises)
          .then(() => {
            // Commit the transaction if all operations succeeded
            db.commit(commitErr => {
              if (commitErr) {
                console.error('Error committing transaction:', commitErr);
                return db.rollback(() => {
                  res.status(500).json({ error: 'Error finalizing order' });
                });
              }
              res.status(201).json({ message: 'Order created successfully' });
            });
          })
          .catch(updateErr => {
            // Rollback the transaction if any quantity update failed
            console.error('Error updating meal quantities:', updateErr);
            db.rollback(() => {
              res.status(500).json({ error: 'Error updating meal quantities' });
            });
          });
      });
    });
  });
});

// Update
router.put("/:id", (req, res) => {
  const query = "UPDATE orders SET order_date=?, status=?, user_id=? WHERE order_id=?";
  db.query(query, [req.body.order_date, req.body.status, req.body.user_id, req.params.id], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json({ message: "orders updated" });
  });
});

// Delete
router.delete("/:id", (req, res) => {
  db.query("DELETE FROM orders WHERE order_id=?", [req.params.id], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json({ message: "orders deleted" });
  });
});
router.post("/full", (req, res) => {
  const { user_id, status, items } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "Items array is required" });
  }

  const order_date = new Date().toISOString().split("T")[0];
  
  // Start a database transaction to ensure data consistency
  db.beginTransaction(err => {
    if (err) {
      console.error('Error starting transaction:', err);
      return res.status(500).json({ error: 'Error starting transaction' });
    }
    
    const insertOrderQuery = "INSERT INTO orders (order_date, status, user_id) VALUES (?, ?, ?)";

    db.query(insertOrderQuery, [order_date, status, user_id], (err, result) => {
      if (err) {
        console.error('Error creating order:', err);
        return db.rollback(() => {
          res.status(500).json({ message: "Error creating order", error: err });
        });
      }

      const orderId = result.insertId;
      const insertItemsQuery = "INSERT INTO order_meal (order_id, meal_id, quantity) VALUES ?";
      const values = items.map(item => [orderId, item.meal_id, item.quantity]);

      db.query(insertItemsQuery, [values], (err2) => {
        if (err2) {
          console.error('Error adding order items:', err2);
          return db.rollback(() => {
            res.status(500).json({ message: "Error adding items", error: err2 });
          });
        }
        
        // Update meal quantities for each ordered item
        const updatePromises = items.map(item => {
          return new Promise((resolve, reject) => {
            const mealId = item.meal_id;
            const quantity = item.quantity;
            
            const updateQuery = `
              UPDATE meals 
              SET quantity = GREATEST(0, quantity - ?) 
              WHERE meal_id = ?
            `;
            
            db.query(updateQuery, [quantity, mealId], (updateErr) => {
              if (updateErr) {
                console.error(`Error updating quantity for meal ${mealId}:`, updateErr);
                reject(updateErr);
              } else {
                console.log(`Updated quantity for meal ${mealId}, decreased by ${quantity}`);
                resolve();
              }
            });
          });
        });

        // Wait for all quantity updates to complete
        Promise.all(updatePromises)
          .then(() => {
            // Commit the transaction if all operations succeeded
            db.commit(commitErr => {
              if (commitErr) {
                console.error('Error committing transaction:', commitErr);
                return db.rollback(() => {
                  res.status(500).json({ error: 'Error finalizing order' });
                });
              }
              res.json({ message: "Order created successfully", orderId });
            });
          })
          .catch(updateErr => {
            // Rollback the transaction if any quantity update failed
            console.error('Error updating meal quantities:', updateErr);
            db.rollback(() => {
              res.status(500).json({ error: 'Error updating meal quantities' });
            });
          });
      });
    });
  });
});
// ✅ Get all orders with user info
router.get("/all", async (req, res) => {
  try {
    const [orders] = await db
      .promise()
      .query(`
        SELECT o.order_id AS id,
               u.first_name,
               u.last_name,
               u.email,
               u.phone,
               u.address,
               u.id_number,
               o.created_at
        FROM orders o
        JOIN users u ON o.user_id = u.user_id
        ORDER BY o.created_at DESC
      `);

    res.status(200).json(orders);
  } catch (error) {
    console.error("שגיאה בקבלת ההזמנות:", error);
    res.status(500).json({ error: "אירעה שגיאה בעת שליפת ההזמנות" });
  }
});




// Patch status only
router.patch("/:id/status", (req, res) => {
  const { status } = req.body;
  if (!status) return res.status(400).json({ message: "status required" });
  db.query("UPDATE orders SET status=? WHERE order_id=?", [status, req.params.id], (err) => {
    if (err) return res.status(500).send(err);
    res.json({ message: "status updated" });
  });
});

module.exports = router;
