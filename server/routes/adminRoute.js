const express = require("express");
const router = express.Router();
const db = require("../dbSingleton").getConnection();
const { verifyToken, isAdmin } = require("../middleware/auth");

/**
 * @route   GET /admin
 * @desc    Get all admin users
 * @access  Admin only
 */
router.get("/", verifyToken, isAdmin, (req, res) => {
  db.query("SELECT * FROM admin", (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

/**
 * @route   GET /admin/:id
 * @desc    Get admin user by ID
 * @access  Admin only
 */
router.get("/:id", verifyToken, isAdmin, (req, res) => {
  db.query(
    "SELECT * FROM admin WHERE id = ?",
    [req.params.id],
    (err, results) => {
      if (err) return res.status(500).send(err);
      if (results.length === 0) return res.status(404).send("admin not found");
      res.json(results[0]);
    }
  );
});

/**
 * @route   POST /admin
 * @desc    Create a new admin user
 * @access  Admin only
 */
router.post("/", verifyToken, isAdmin, (req, res) => {
  const query =
    "INSERT INTO admin (id, first_name, last_name, address, phone, email, user_type) VALUES (?, ?, ?, ?, ?, ?, ?)";
  db.query(
    query,
    [
      req.body.id,
      req.body.first_name,
      req.body.last_name,
      req.body.address,
      req.body.phone,
      req.body.email,
      req.body.user_type,
    ],
    (err, results) => {
      if (err) return res.status(500).send(err);
      res.json({ message: "admin created", id: results.insertId });
    }
  );
});

/**
 * @route   PUT /admin/:id
 * @desc    Update admin user
 * @access  Admin only
 */
router.put("/:id", verifyToken, isAdmin, (req, res) => {
  const query =
    "UPDATE admin SET first_name=?, last_name=?, address=?, phone=?, email=?, user_type=? WHERE id=?";
  db.query(
    query,
    [
      req.body.first_name,
      req.body.last_name,
      req.body.address,
      req.body.phone,
      req.body.email,
      req.body.user_type,
      req.params.id,
    ],
    (err, results) => {
      if (err) return res.status(500).send(err);
      res.json({ message: "admin updated" });
    }
  );
});

// Delete
router.delete("/:id", (req, res) => {
  db.query("DELETE FROM admin WHERE id=?", [req.params.id], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json({ message: "admin deleted" });
  });
});

module.exports = router;
