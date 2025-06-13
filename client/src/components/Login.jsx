import React from "react";
import { Link } from "react-router-dom";
import "../styles/Login.css";

export default function Login() {
  return (
    <div className="login-container">
      <h2>🔐 התחברות לאתר</h2>
      <form className="login-form" onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="email">אימייל</label>
        <input type="email" id="email" name="email" required />

        <label htmlFor="password">סיסמה</label>
        <input type="password" id="password" name="password" required />

        <button type="submit">התחבר</button>

       <nav>
        <Link to="/resetpass">שכחתי סיסמא?</Link>
          <Link to="/homepage">חזרה לדף הבית </Link>
          <Link to="/signup">להרשמה</Link>
       </nav>
      </form>
    </div>
  );
}