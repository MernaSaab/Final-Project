import React, { useState } from "react";
import { Link } from "react-router-dom";

import "../styles/AdminUsers.css";

export default function AdminUsers() {
  const [search, setSearch] = useState("");

  const users = [
    {
      id: 1,
      firstName: "דנה",
      lastName: "כהן",
      email: "dana@email.com",
      phone: "050-1234567",
      age: 28,
      status: "פעיל",
    },
    {
      id: 2,
      firstName: "רועי",
      lastName: "לוי",
      email: "roi@email.com",
      phone: "052-7654321",
      age: 34,
      status: "פעיל",
    },
  ];

  const filteredUsers = users.filter((user) =>
    user.firstName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <header>
        <h1>מערכת ניהול משתמשים</h1>
        <nav>
          <Link to="/admin">דף מנהל</Link>
          <Link to="/orders">הזמנות</Link>
          <Link to="/addmeal">הוסף מנות</Link>
          <Link to="/deletemeal">מחק מנות</Link>
          <Link to="/">חזרה לאתר</Link>
        </nav>
      </header>

      <main>
        <h2>רשימת משתמשים רשומים</h2>
        <div className="search-box">
          <input
            type="text"
            placeholder="חפש לפי שם משתמש..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <table>
          <thead>
            <tr>
              <th>מס'</th>
              <th>שם פרטי</th>
              <th>שם משפחה</th>
              <th>אימייל</th>
              <th>טלפון</th>
              <th>גיל</th>
              <th>סטטוס</th>
              <th>פעולה</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.age}</td>
                <td>{user.status}</td>
                <td>
                  <a href="updateUser.html" className="btn-update">
                    עדכן
                  </a>
                  <button className="btn-delete">מחק</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>

      <footer>
        <p>כל הזכויות שמורות</p>
      </footer>
    </div>
  );
}
