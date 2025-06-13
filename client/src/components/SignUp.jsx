import React from "react";
import { Link } from "react-router-dom";

import "../styles/SignUp.css";

export default function SignUp() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("📝 נרשמת בהצלחה! ברוך הבא לאתר שלנו");
  };

  return (
    <div className="register-container">
      <h2>הרשמה לאתר</h2>
      <form className="register-form" onSubmit={handleSubmit}>
        <label>
          שם פרטי
          <input type="text" required />
        </label>

        <label>
          שם משפחה
          <input type="text" required />
        </label>

        <label>
          גיל:
          <input type="number" required min="1" />
        </label>

        <label>
          תעודת זהות
          <input type="text" required maxLength="9" />
        </label>

        <label>
          מספר טלפון
          <input type="tel" required pattern="[0-9]{10}" />
        </label>

        <label>
          אימייל
          <input type="email" required />
        </label>

        <label>
          סיסמה
          <input type="password" required />
        </label>

        <label>
          אימות סיסמה
          <input type="password" required />
        </label>

        <button type="submit">הרשמה</button>
      </form>
<nav>
   
  כבר רשומים? <Link to="/login">התחברות</Link> |
  <Link to="/homepage">חזרה לדף הבית</Link>

</nav>
    </div>
  );
}