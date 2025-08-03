const express = require("express");
const router = express.Router();
const db = require("../dbSingleton");

// POST /contact – שליחת הודעה
router.post("/", async (req, res) => {
  const { full_name, email, subject, message } = req.body;

  try {
    const sql = `
      INSERT INTO contact_messages (full_name, email, subject, message)
      VALUES (?, ?, ?, ?)
    `;
    await db.execute(sql, [full_name, email, subject, message]);

    res.status(201).json({ message: "ההודעה נשלחה בהצלחה!" });
  } catch (err) {
    console.error("DB Error:", err);
    res.status(500).json({ error: "אירעה שגיאה בעת שליחת ההודעה" });
  }
});

module.exports = router;