import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Orders.css";

export default function Orders() {
  const [orders, setOrders] = useState([
    {
      id: "#1001",
      name: "דנה כהן",
      email: "dana@email.com",
      date: "16/04/2025",
      meals: "סלט קינואה, שייק ירוק",
      quantity: "1, 2",
      status: "pending",
    },
    {
      id: "#1002",
      name: "רועי לוי",
      email: "roi@email.com",
      date: "16/04/2025",
      meals: "חזה עוף עם בטטה",
      quantity: "3",
      status: "sent",
    },
  ]);

  const handleDelete = (id) => {
    if (window.confirm("האם למחוק את ההזמנה?")) {
      setOrders(orders.filter((order) => order.id !== id));
    }
  };

  return (
    <div className="orders-container">
      <header>
        <h1>מערכת ניהול הזמנות</h1>
        <nav>
          <Link to="/admin">דף מנהל</Link>
            <Link to="/homepage">חזרה לאתר</Link>
            <Link to="/deletemeal">מחק מנות</Link>
            <Link to="/addmeals">הוספת מנות </Link>
        </nav>
      </header>

      <main>
        <h2>רשימת הזמנות</h2>
        <table>
          <thead>
            <tr>
              <th>מס'</th>
              <th>שם הלקוח</th>
              <th>אימייל</th>
              <th>תאריך</th>
              <th>מנות</th>
              <th>כמות</th>
              <th>סטטוס</th>
              <th>פעולה</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, i) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.name}</td>
                <td>{order.email}</td>
                <td>{order.date}</td>
                <td>{order.meals}</td>
                <td>{order.quantity}</td>
                <td>
                  <span className={`status ${order.status}`}>
                    {order.status === "pending" ? "בטיפול" : "נשלח"}
                  </span>
                </td>
                <td>
                  <a href="updateOrder.html" className="btn-update">
                    עדכן
                  </a>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(order.id)}
                  >
                    מחק
                  </button>
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