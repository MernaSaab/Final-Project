import React from "react";
import { Link } from "react-router-dom";
import "../styles/ContactUs.css";

export default function ContactUs() {
  return (
    <div className="contact-container">
      <h2>צור קשר</h2>
      <p>נשמח לשמוע ממך! מלא את הפרטים ונחזור אליך בהקדם</p>
      <form className="contact-form">
        <label>
          שם מלא
          <input type="text" required />
        </label>

        <label>
          אימייל
          <input type="email" required />
        </label>

        <label>
          נושא
          <input type="text" required />
        </label>

        <label>
          הודעה
          <textarea rows="5" required></textarea>
        </label>

        <button type="submit">שלח הודעה</button>
      </form>
      <nav>
     <Link to="/homepage" className="home-btn">
  ⬅️ חזרה לדף הבית
</Link>
</nav>

    </div>
  );
}