import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import AdminNavbar from "../components/AdminNavbar";
import LoadingSpinner from "../components/LoadingSpinner";
import "./AdminMessages.css";

function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  useEffect(() => {
    // בדיקה אם המשתמש מחובר ואם הוא מנהל
    if (!isAdmin()) {
      navigate("/");
      return;
    }

    const fetchMessages = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = sessionStorage.getItem("auth_token");
        if (!token) {
          throw new Error("אין אימות משתמש");
        }

        // בקשת ההודעות מהשרת עם אימות
        const response = await fetch("http://localhost:3001/contact/messages", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          credentials: "include"
        });

        if (!response.ok) {
          throw new Error(`שגיאת שרת: ${response.status}`);
        }

        const data = await response.json();
        setMessages(data);
      } catch (err) {
        console.error("שגיאה בקבלת ההודעות:", err);
        setError("לא ניתן לטעון הודעות כרגע. אנא נסה שוב מאוחר יותר.");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [navigate, isAdmin]);

  return (
    <div className="admin-container">
      <AdminNavbar />
      <div className="admin-content">
        <div className="admin-header-actions">
          <h2>הודעות שהתקבלו</h2>
          <Link to="/admin" className="back-button">חזרה לדף הניהול</Link>
        </div>

        {loading ? (
          <LoadingSpinner message="טוען הודעות..." />
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : messages.length === 0 ? (
          <p className="no-data-message">אין הודעות להצגה.</p>
        ) : (
          <div className="messages-table-container">
            <table className="messages-table">
              <thead>
                <tr>
                  <th>שם מלא</th>
                  <th>אימייל</th>
                  <th>מספר טלפון</th>
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
                    <td>{msg.number}</td>
                    <td>{msg.subject}</td>
                    <td className="message-content">{msg.message}</td>
                    <td>{new Date(msg.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminMessages;
