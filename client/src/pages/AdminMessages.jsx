import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminMessages.css";

function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // בדיקה אם המשתמש מחובר ואם הוא מנהל
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || user.role !== "admin") {
      alert("אין לך הרשאה לצפות בדף זה");
      navigate("/");
      return;
    }

    // בקשת ההודעות מהשרת
    fetch("http://localhost:3001/contact/messages")
      .then((res) => res.json())
      .then((data) => setMessages(data))
      .catch((err) => {
        console.error("שגיאה בקבלת ההודעות:", err);
        alert("לא ניתן לטעון הודעות כרגע");
      });
  }, [navigate]);

  return (
    <div className="admin-messages-container">
      <h2>הודעות שהתקבלו</h2>
      {messages.length === 0 ? (
        <p>אין הודעות להצגה.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>שם מלא</th>
              <th>אימייל</th>
              <th>נושא</th>
              <th>הודעה</th>
              <th>תאריך</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((msg) => (
              <tr key={msg.id}>
                <td>{msg.full_name}</td>
                <td>{msg.email}</td>
                <td>{msg.subject}</td>
                <td>{msg.message}</td>
                <td>{new Date(msg.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminMessages;
