
const express = require("express");
const router = express.Router();
const db = require("../dbSingleton").getConnection();

// Get all
router.get("/", (req, res) => {
  db.query("SELECT * FROM categories", (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Get by ID
router.get("/:id", (req, res) => {
  db.query("SELECT * FROM categories WHERE category_id = ?", [req.params.id], (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length === 0) return res.status(404).send("categories not found");
    res.json(results[0]);
  });
});

// Create
router.post("/", (req, res) => {
  const query = "INSERT INTO categories (category_id, category_name) VALUES (?, ?)";
  db.query(query, [req.body.category_id, req.body.category_name], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json({ message: "categories created", id: results.insertId });
  });
});

// Update
router.put("/:id", (req, res) => {
  const query = "UPDATE categories SET category_name=? WHERE category_id=?";
  db.query(query, [req.body.category_name, req.params.id], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json({ message: "categories updated" });
  });
});

// Delete
router.delete("/:id", (req, res) => {
  db.query("DELETE FROM categories WHERE category_id=?", [req.params.id], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json({ message: "categories deleted" });
  });
});

module.exports = router;
