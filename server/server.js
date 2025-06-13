const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

// שליפת מנות
app.get("/meals", (req, res) => {
  db.query("SELECT * FROM meals", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// הוספת הזמנה
app.post("/orders", (req, res) => {
  const { user_id, meals, quantity, status } = req.body;
  const query = "INSERT INTO orders (user_id, meals, quantity, status) VALUES (?, ?, ?, ?)";
  db.query(query, [user_id, meals, quantity, status], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ success: true, id: result.insertId });
  });
});

app.listen(3001, () => {
  console.log("🚀 השרת רץ על http://localhost:3001");
});


