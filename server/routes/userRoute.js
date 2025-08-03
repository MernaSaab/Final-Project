const express = require("express");
const router = express.Router();
const db = require("../dbSingleton").getConnection();
const { verifyToken, isAdmin } = require("../middleware/auth");

router.get("/", (req, res) => {
  const query = "SELECT * from users";
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.json(results);
  });
});

// Get single user by numeric id or prefixed id
router.get("/:id", (req, res) => {
  let id = req.params.id;
  const userId = id.startsWith('u') ? id : 'u' + id;
  db.query("SELECT * FROM users WHERE user_id = ?", [userId], (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length === 0) return res.status(404).json({ message: "User not found" });
    res.json(results[0]);
  });
});

router.post("/", (req, res) => {
  const { first_name, last_name, address, phone, email } = req.body;
  const query =
    "INSERT INTO users (first_name, last_name, address, phone, email) VALUES (?,?,?,?,?)";
  db.query(
    query,
    [first_name, last_name, address, phone, email],
    (err, results) => {
      if (err) {
        res.status(500).send(err);
        return;
      }
      res.json({ message: "user created", id: results.insertedId });
    }
  );
});

router.put("/:id", (req, res) => {
  const id = req.params.id;
  const { first_name, last_name, address, phone, email } = req.body;
  const query =
    "UPDATE users set first_name=?, last_name=?,address=?,phone=?,email=? where user_id=?";
  db.query(
    query,
    [first_name, last_name, address, phone, email, 'u' + id],
    (err, results) => {
      if (err) {
        res.status(500).send(err);
        return;
      }
      res.json({ message: "User updated" });
    }
  );
});

router.delete("/:id", (req, res) => {
  const id = req.params.id;
  const userId = 'u' + id;
  
  // First get all orders for this user
  db.query("SELECT order_id FROM orders WHERE user_id = ?", [userId], (orderErr, orderResults) => {
    if (orderErr) {
      console.error('Error getting user orders:', orderErr);
      return res.status(500).json({ error: orderErr.message });
    }
    
    // If user has orders, delete them and their related order_meal entries
    if (orderResults.length > 0) {
      // Extract order IDs
      const orderIds = orderResults.map(order => order.order_id);
      
      // Delete all order_meal entries for these orders
      const deleteOrderMealsPromises = orderIds.map(orderId => {
        return new Promise((resolve, reject) => {
          db.query("DELETE FROM order_meal WHERE order_id = ?", [orderId], (err) => {
            if (err) {
              console.error(`Error deleting order_meal for order ${orderId}:`, err);
              // Continue anyway
            }
            resolve();
          });
        });
      });
      
      // After deleting order_meal entries, delete the orders
      Promise.all(deleteOrderMealsPromises)
        .then(() => {
          // Delete all orders for this user
          db.query("DELETE FROM orders WHERE user_id = ?", [userId], (err) => {
            if (err) {
              console.error('Error deleting user orders:', err);
              return res.status(500).json({ error: err.message });
            }
            
            // Finally delete the user
            deleteUser();
          });
        })
        .catch(err => {
          console.error('Error in promise chain:', err);
          return res.status(500).json({ error: 'Error deleting related records' });
        });
    } else {
      // No orders, directly delete the user
      deleteUser();
    }
  });
  
  // Helper function to delete the user
  function deleteUser() {
    db.query("DELETE FROM users WHERE user_id = ?", [userId], (err, results) => {
      if (err) {
        console.error('Error deleting user:', err);
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: "User deleted successfully" });
    });
  }
});

/**
 * @route   GET /users/count
 * @desc    Get the total count of users
 * @access  Admin only
 */
router.get("/count", verifyToken, isAdmin, (req, res) => {

  const query = "SELECT COUNT(*) as count FROM users";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error getting user count:", err);
      return res.status(500).json({ message: "Error getting user count", error: err.message });
    }
    res.json({ count: results[0].count });
  });
});

module.exports = router;
