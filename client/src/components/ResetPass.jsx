import React from "react";
import { Link } from "react-router-dom";

import "../styles/ResetPass.css";

export default function ResetPass() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("קישור לאיפוס סיסמה נשלח לאימייל 🎯");
  };

  return (
    <div className="reset-container">
      <h2>🔐 שחזור סיסמה</h2>
      <p>הכנס את כתובת האימייל שלך ונשלח אליך קישור לאיפוס הסיסמה</p>
      <form className="reset-form" onSubmit={handleSubmit}>
        <label>
          אימייל:
          <input type="email" placeholder="example@email.com" required />
        </label>
        <button type="submit">שלח קישור לאיפוס</button>
      </form>

      <div className="back-links">
  <Link to="/login" className="back-btn">⬅️ חזרה להתחברות</Link>
  <Link to="/homepage" className="back-btn">🏠 דף הבית</Link>
</div>

    </div>
  );
}