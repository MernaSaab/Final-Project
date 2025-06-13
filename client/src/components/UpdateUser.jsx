
import React, { useState } from "react";
import { Link } from "react-router-dom";

import "../styles/UpdateUser.css";

export default function UpdateUser() {
  const [user, setUser] = useState({
    firstName: "דנה",
    lastName: "כהן",
    email: "dana@email.com",
    phone: "050-1234567",
    age: 28,
    status: "פעיל",
  });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`👤 עודכן משתמש: ${user.firstName} ${user.lastName}`);
  };

  return (
    <div>
      <header>
        <h1>📝 עדכון פרטי משתמש</h1>
        <nav>
          <Link to="/admin">דף ניהול </Link>
          <Link to="/adminusers">רשימת משתמשים</Link>
          <Link to="/orders">הזמנות</Link>
          <Link to="/homepage">חזרה לאתר </Link>
        </nav>
      </header>

      <main>
        <form className="update-user-form" onSubmit={handleSubmit}>
          <label>
            שם פרטי:
            <input
              type="text"
              name="firstName"
              value={user.firstName}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            שם משפחה:
            <input
              type="text"
              name="lastName"
              value={user.lastName}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            אימייל:
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            טלפון:
            <input
              type="tel"
              name="phone"
              value={user.phone}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            גיל:
            <input
              type="number"
              name="age"
              value={user.age}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            סטטוס:
            <select name="status" value={user.status} onChange={handleChange}>
              <option value="פעיל">פעיל</option>
              <option value="מוקפא">מוקפא</option>
            </select>
          </label>

          <div className="form-actions">
            <button type="submit">💾 שמור שינויים</button>
           <Link to="/adminusers" className="back-btn">
  ⬅️ חזרה לרשימת המשתמשים
</Link>
 
          </div>
        </form>
      </main>

      <footer>
        <p>דף עדכון משתמש</p>
      </footer>
    </div>
  );
}