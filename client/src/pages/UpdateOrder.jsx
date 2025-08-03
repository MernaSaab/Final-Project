import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './UpdateOrder.css';

const UpdateOrder = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const orderId = queryParams.get('id');

  // Initial form state
  const [formData, setFormData] = useState({
    meals: '',
    quantity: '',
    status: 'בטיפול'
  });

  const [message, setMessage] = useState('');

  // In a real app, you would fetch the order details from an API
  useEffect(() => {
    // Mock data - simulating API fetch based on orderId
    if (orderId === '1001') {
      setFormData({
        meals: 'סלט קינואה, שייק ירוק',
        quantity: '3',
        status: 'בטיפול'
      });
    } else if (orderId === '1002') {
      setFormData({
        meals: 'חזה עוף עם בטטה',
        quantity: '3',
        status: 'נשלח'
      });
    } else if (orderId === '1003') {
      setFormData({
        meals: 'סלט השף, מרק עדשים',
        quantity: '2',
        status: 'הושלם'
      });
    }
  }, [orderId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would make an API call to update the order
    console.log('Order data to be updated:', { orderId, ...formData });
    
    // Show success message
    setMessage('ההזמנה עודכנה בהצלחה!');
    
    // Clear message after 2 seconds and redirect
    setTimeout(() => {
      setMessage('');
      navigate('/orders');
    }, 2000);
  };

  return (
    <div className="update-order-container">
      <header>
        <h1>📝 עדכון פרטי הזמנה #{orderId}</h1>
        <nav>
          <Link to="/admin">דף ניהול</Link>
          <Link to="/orders">הזמנות</Link>
          <Link to="/admin/users">משתמשים</Link>
          <Link to="/admin/add-meal">הוספת מנה</Link>
          <Link to="/admin/delete-meal">מחיקת מנה</Link>
        </nav>
      </header>

      <main>
        {message && <div className="success-message">{message}</div>}
        
        <form className="update-form" onSubmit={handleSubmit}>
          <label>
            מנות:
            <textarea
              name="meals"
              rows="3"
              placeholder="למשל: סלט קינואה, שייק ירוק"
              value={formData.meals}
              onChange={handleChange}
              required
            ></textarea>
          </label>

          <label>
            כמות כוללת:
            <input 
              type="number" 
              name="quantity" 
              min="1" 
              value={formData.quantity}
              onChange={handleChange}
              required 
            />
          </label>

          <label>
            סטטוס ההזמנה:
            <select 
              name="status" 
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="בטיפול">בטיפול</option>
              <option value="נשלח">נשלח</option>
              <option value="הושלם">הושלם</option>
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
};

export default UpdateOrder;
