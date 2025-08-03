
const express = require("express");
const router = express.Router();
const db = require("../dbSingleton").getConnection();

// Get all
router.get("/", (req, res) => {
  db.query("SELECT * FROM category_meal", (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Get by ID
router.get("/:id", (req, res) => {
  db.query("SELECT * FROM category_meal WHERE meal_id = ?", [req.params.id], (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length === 0) return res.status(404).send("category_meal not found");
    res.json(results[0]);
  });
});

// Create
router.post("/", (req, res) => {
  const query = "INSERT INTO category_meal (category_id, meal_id) VALUES (?, ?)";
  db.query(query, [req.body.category_id, req.body.meal_id], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json({ message: "category_meal created", id: results.insertId });
  });
});

// Update
router.put("/:id", (req, res) => {
  const query = "UPDATE category_meal SET category_id=? WHERE meal_id=?";
  db.query(query, [req.body.category_id, req.params.id], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json({ message: "category_meal updated" });
  });
});

// Delete
router.delete("/:id", (req, res) => {
  db.query("DELETE FROM category_meal WHERE meal_id=?", [req.params.id], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json({ message: "category_meal deleted" });
  });
});

module.exports = router;
