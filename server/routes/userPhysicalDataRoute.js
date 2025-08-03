const express = require("express");
const router = express.Router();
const db = require("../dbSingleton").getConnection();

// Get all
router.get("/", (req, res) => {
  db.query("SELECT * FROM user_physicaldata", (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Get by ID
router.get("/:id", (req, res) => {
  db.query(
    "SELECT * FROM user_physicaldata WHERE user_id = ?",
    [req.params.id],
    (err, results) => {
      if (err) return res.status(500).send(err);
      if (results.length === 0)
        return res.status(404).send("user_physicaldata not found");
      res.json(results[0]);
    }
  );
});

// Create
router.post("/", (req, res) => {
  const query =
    "INSERT INTO user_physicaldata (user_id, age, weight, height, activity_level, gender) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(
    query,
    [
      req.body.user_id,
      req.body.age,
      req.body.weight,
      req.body.height,
      req.body.activity_level,
      req.body.gender,
    ],
    (err, results) => {
      if (err) return res.status(500).send(err);
      res.json({ message: "user_physicaldata created", id: results.insertId });
    }
  );
});

// Update
router.put("/:id", (req, res) => {
  const query =
    "UPDATE user_physicaldata SET age=?, weight=?, height=?, activity_level=?, gender=? WHERE user_id=?";
  db.query(
    query,
    [
      req.body.age,
      req.body.weight,
      req.body.height,
      req.body.activity_level,
      req.body.gender,
      req.params.id,
    ],
    (err, results) => {
      if (err) return res.status(500).send(err);
      res.json({ message: "user_physicaldata updated" });
    }
  );
});

// Delete
router.delete("/:id", (req, res) => {
  db.query(
    "DELETE FROM user_physicaldata WHERE user_id=?",
    [req.params.id],
    (err, results) => {
      if (err) return res.status(500).send(err);
      res.json({ message: "user_physicaldata deleted" });
    }
  );
});

module.exports = router;
