import React from "react";
import { Link } from "react-router-dom";

import "../styles/AddMeals.css";

export default function AddMeals() {
  return (
    <div>
      <header>
        <h1>🍽️ הוספת מנה חדשה</h1>
        <nav>
          <Link to="/admin">דף ניהול</Link>
          <Link to="/orders">הזמנות</Link>
          <Link to="/adminusers">ניהול משתמשים</Link>
          <Link to="/deletemeal">מחיקת מנות</Link>
        </nav>
      </header>

      <main>
        <form className="meal-form">
          <label>
            שם המנה:
            <input type="text" name="mealName" required />
          </label>

          <label>
            תיאור המנה:
            <textarea name="mealDescription" rows="4" required></textarea>
          </label>

          <label>
            תמונה (קישור):
            <input
              type="url"
              name="mealImage"
              placeholder="https://example.com/image.jpg"
            />
          </label>

          <label>
            מחיר:
            <input type="number" name="mealPrice" step="0.01" required />
          </label>

          <label>
            כמות זמינה:
            <input type="number" name="mealQuantity" required />
          </label>

          <button type="submit">➕ הוסף מנה</button>
        </form>
      </main>

      <footer>
        <p>כל הזכויות שמורות</p>
      </footer>
    </div>
  );
}
