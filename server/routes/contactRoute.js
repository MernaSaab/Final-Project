const express = require("express");
const router = express.Router();
const db = require("../dbSingleton").getConnection();

// POST /contact – שליחת הודעה
router.post("/", (req, res) => {
  console.log("Received contact form submission:", req.body);
  const { full_name, email, subject, message, number } = req.body;

  // בדיקת תקינות הנתונים
  if (!full_name || !email || !subject || !message) {
    console.error("Missing required fields in contact form");
    return res.status(400).json({ error: "כל השדות נדרשים" });
  }
  
  // אם מספר הטלפון לא נשלח, נשתמש בערך ריק
  const phoneNumber = number || "";

  // הכנסת ההודעה לטבלה
  const sql = "INSERT INTO contact_messages (full_name, email, subject, message, number) VALUES (?, ?, ?, ?, ?)";
  const values = [full_name, email, subject, message, phoneNumber];
  
  console.log("Executing SQL:", sql);
  console.log("With values:", values);
  
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error inserting message:", err);
      return res.status(500).json({ error: "אירעה שגיאה בשמירת ההודעה" });
    }
    
    console.log("Message saved successfully, ID:", result.insertId);
    res.status(201).json({ message: "ההודעה נשלחה בהצלחה!" });
  });
});

// GET /contact/messages - קבלת כל ההודעות (למנהל בלבד)
router.get("/messages", (req, res) => {
  // שליפת ההודעות
  db.query("SELECT * FROM contact_messages ORDER BY created_at DESC", (err, messages) => {
    if (err) {
      console.error("Error fetching messages:", err);
      return res.status(500).json({ error: "אירעה שגיאה בקבלת ההודעות" });
    }
    
    res.json(messages);
  });
});

module.exports = router;