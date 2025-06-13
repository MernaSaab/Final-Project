import React, { useState } from "react";
import { Link } from "react-router-dom";


import "../styles/UpdateOrder.css";

export default function UpdateOrder() {
  const [meals, setMeals] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState("בטיפול");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`✨ ההזמנה עודכנה!\nמנות: ${meals}\nכמות: ${quantity}\nסטטוס: ${status}`);
  };

  return (
    <div>
      <header>
        <h1>📝 עדכון פרטי הזמנה</h1>
        <nav>
          
  <Link to="/admin">דף ניהול</Link>
  <Link to="/orders">הזמנות</Link>
  <Link to="/adminusers">משתמשים</Link>
  <Link to="/addmeal">הוספת מנה</Link>
  <Link to="/deletemeal">מחיקת מנות</Link>


        </nav>
      </header>

      <main>
        <form className="update-form" onSubmit={handleSubmit}>
          <label>
            מנות:
            <textarea
              name="meals"
              rows="3"
              placeholder="למשל: סלט קינואה, שייק ירוק"
              required
              value={meals}
              onChange={(e) => setMeals(e.target.value)}
            ></textarea>
          </label>

          <label>
            כמות כוללת:
            <input
              type="number"
              name="quantity"
              min="1"
              required
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </label>

          <label>
            סטטוס ההזמנה:
            <select
              name="status"
              required
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="בטיפול">בטיפול</option>
              <option value="נשלח">נשלח</option>
              <option value="בוטל">בוטל</option>
            </select>
          </label>

          <div className="form-actions">
            <button type="submit">💾 שמור שינויים</button>
            <Link to="/orders" className="back-btn">⬅️ חזרה להזמנות</Link>

             </div>
        </form>
      </main>

      <footer>
        <p>עדכון הזמנה</p>
      </footer>
    </div>
  );
}