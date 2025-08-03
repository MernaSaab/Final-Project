import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './UserOrders.css';
import axios from 'axios';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [orderToDelete, setOrderToDelete] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userId = localStorage.getItem('user_id');
        const response = await axios.get(`http://localhost:3001/orders/user/${userId}`);
        setOrders(response.data);
      } catch (err) {
        console.error("שגיאה בשליפת הזמנות:", err);
      }
    };
    fetchOrders();
  }, []);

  const handleDeleteClick = (order) => {
    setOrderToDelete(order);
    setConfirmMessage(`האם אתה בטוח שברצונך למחוק את הזמנה מספר #${order.order_id}?`);
  };

  const confirmDelete = () => {
    if (orderToDelete) {
      setOrders(orders.filter(o => o.order_id !== orderToDelete.order_id));
      setConfirmMessage('');
      setOrderToDelete(null);
    }
  };

  const cancelDelete = () => {
    setConfirmMessage('');
    setOrderToDelete(null);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'בטיפול':
        return 'pending';
      case 'נשלח':
        return 'sent';
      case 'הושלם':
        return 'completed';
      default:
        return '';
    }
  };

  return (
    <div className="user-orders-container">
      <header className="user-orders-header">
        <h1>ההזמנות שלי</h1>
        <nav className="user-orders-nav">
          <Link to="/">חזרה לדף הבית</Link>
          <Link to="/meals">תפריט מנות</Link>
          <Link to="/profile">הפרופיל שלי</Link>
        </nav>
      </header>

      <main className="user-orders-main">
        {confirmMessage && (
          <div className="user-orders-confirm-dialog">
            <p>{confirmMessage}</p>
            <div className="user-orders-confirm-actions">
              <button onClick={confirmDelete} className="user-orders-confirm-btn">כן, מחק</button>
              <button onClick={cancelDelete} className="user-orders-cancel-btn">ביטול</button>
            </div>
          </div>
        )}

        <h2>רשימת הזמנות</h2>
        <div className="user-orders-table-container">
          <table className="user-orders-table">
            <thead>
              <tr>
                <th>מס'</th>
                <th>פריטים</th>
                <th>תאריך</th>
                <th>סטטוס</th>
                <th>קבלה</th>
                <th>פעולה</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.order_id}>
                  <td>#{order.order_id}</td>
                  <td>{order.items}</td>
                  <td>{order.order_date}</td>
                  <td>
                    <span className={`user-orders-status ${getStatusClass(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <Link 
                      to={`/receipt/${order.order_id}`}
                      className="user-orders-btn-receipt"
                    >
                      🧾 קבלה
                    </Link>
                  </td>
                  <td>
                    <button className="user-orders-btn-delete" onClick={() => handleDeleteClick(order)}>מחק</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <footer className="user-orders-footer">
        <p>כל הזכויות שמורות</p>
      </footer>
    </div>
  );
};

export default Orders;