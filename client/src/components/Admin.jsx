import React from "react";
import { Link } from "react-router-dom";

import "../styles/Admin.css";

export default function Admin() {
  return (
    <div className="admin-container">
      <h1>שלום מנהל 👋</h1>
      <p>כאן תוכל לנהל את האתר בקלות</p>

      <div className="stats">
        <div className="card">
          <h3>🧍‍♂️ משתמשים רשומים</h3>
          <p>127</p>
        </div>
        <div className="card">
          <h3>🍱 סך מנות</h3>
          <p>34</p>
        </div>
        <div className="card">
          <h3>🛒 הזמנות</h3>
          <p>89</p>
        </div>
      </div>

      <div className="admin-actions">
        <Link to="/">חזרה לאתר</Link>
        <Link to="/orders">הזמנות</Link>
        <Link to="/adminusers">ניהול משתמשים</Link>
        <Link to="/addmeal">הוספת מנה</Link>
        <Link to="/deletemeal">מחיקת מנות</Link>
      </div>
    </div>
  );
}
