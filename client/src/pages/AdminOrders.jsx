// src/pages/AdminOrders.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Admin.css";
import { Link } from "react-router-dom";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:3001/orders/all");
      setOrders(res.data);
    } catch (err) {
      setError("שגיאה בטעינת ההזמנות");
      console.error(err);
    }
  };

  // Update status
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.patch(`http://localhost:3001/orders/${orderId}/status`, { status: newStatus });
      setOrders(prev => prev.map(o => o.order_id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
      console.error(err);
      alert('שגיאה בעדכון הסטטוס');
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="admin-container">
      <h1 className="main-header">📦 הזמנות מהלקוחות</h1>
      {error && <div className="error-message">{error}</div>}

      <div className="admin-section">
        <h2>רשימת הזמנות</h2>
        {orders.length === 0 ? (
          <p>אין הזמנות להצגה.</p>
        ) : (
          <table className="orders-table">
            <thead>
              <tr>
                <th>מספר הזמנה</th>
                <th>תאריך</th>
                <th>שם משתמש</th>
                <th>פריטים</th>
                <th>סטטוס</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.order_id}>
                  <td>{order.order_id}</td>
                  <td>{order.order_date ? new Date(order.order_date).toLocaleDateString('he-IL') : '—'}</td>
                  <td>{`${order.first_name || ''} ${order.last_name || ''}`.trim() || '—'}</td>
                  <td>{order.items}</td>
                  <td>
                    <select value={order.status} onChange={e => handleStatusChange(order.order_id, e.target.value)}>
                      <option value="pending">pending</option>
                      <option value="processing">processing</option>
                      <option value="delivered">delivered</option>
                      <option value="canceled">canceled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div style={{ marginTop: "2rem" }}>
        <Link to="/admin" className="admin-link">⬅ חזרה לניהול</Link>
      </div>
    </div>
  );
};

export default AdminOrders;