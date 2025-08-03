import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { mealApi } from '../services/api';


import './Payment.css';

const Payment = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, totalPrice } = location.state || { cart: [], totalPrice: 0 };

  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
const [firstName, setFirstName] = useState('');
const [lastName, setLastName] = useState('');
const [phone, setPhone] = useState('');
const [email, setEmail] = useState('');
const [address, setAddress] = useState('');

const [paymentMethod, setPaymentMethod] = useState('creditCard');


  // Add slash automatically after entering month in expiry input
  const handleExpiryChange = (e) => {
    let value = e.target.value;
    // Remove all non-digit and non-slash characters
    value = value.replace(/[^\d\/]/g, '');
    // Add slash after two digits if not present
    if (value.length === 2 && !value.includes('/')) {
      value = value + '/';
    }
    // Limit to 5 characters MM/YY
    if (value.length > 5) {
      value = value.slice(0, 5);
    }
    setExpiry(value);
  };
  const [cvv, setCvv] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);

  const handlePayment = async (e) => {
  e.preventDefault();

  if (!firstName || !lastName || !phone || !email || !address || !cardNumber || !expiry || !cvv || !idNumber) {
    setMessage('אנא מלא את כל הפרטים הנדרשים כולל תשלום ופרטים אישיים');
    setError(true);
    return;
  }

  try {
    // Build full order payload with personal details
    const fullOrderPayload = {
      user_id: user?.user_id || user?.id,
      status: 'pending',
      first_name: firstName,
      last_name: lastName,
      phone,
      email,
      id_number: idNumber,
      address,
      items: cart.map((item) => ({
        meal_id: item.id,
        quantity: item.qty,
      })),
    };

    await mealApi.createFullOrder(fullOrderPayload);

    setMessage('התשלום בוצע בהצלחה! ההזמנה נשלחה.');
    setError(false);
    localStorage.removeItem('cart');
    setTimeout(() => navigate('/'), 3000);
  } catch (error) {
    console.error(error);
    setMessage('אירעה שגיאה בתשלום');
    setError(true);
  }

};

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="payment-container">
      <h2>תשלום</h2>
      <div className="order-summary">
        <h3>סיכום הזמנה</h3>
        <ul>
          {cart.map((item) => (
            <li key={item.id}>
              {item.name} - {item.qty} x ₪{item.price}
            </li>
          ))}
        </ul>
        <p>סה"כ לתשלום: ₪{totalPrice}</p>
      </div>
      <form className="payment-form" onSubmit={handlePayment}>
        <label>
  שם פרטי:
  <input
    type="text"
    value={firstName}
    onChange={(e) => setFirstName(e.target.value)}
    required
  />
</label>

<label>
  שם משפחה:
  <input
    type="text"
    value={lastName}
    onChange={(e) => setLastName(e.target.value)}
    required
  />
</label>

<label>
  טלפון:
  <input
    type="tel"
    value={phone}
    onChange={(e) => setPhone(e.target.value)}
    required
  />
</label>

<label>
  אימייל:
  <input
    type="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    required
  />
</label>

<label>
  כתובת:
  <input
    type="text"
    value={address}
    onChange={(e) => setAddress(e.target.value)}
    required
  />
  <label>
  אמצעי תשלום:
  <select
    value={paymentMethod}
    onChange={(e) => setPaymentMethod(e.target.value)}
    required
  >
    <option value="creditCard">כרטיס אשראי</option>
    <option value="paypal">PayPal</option>
  </select>
</label>

</label>

        <label>
          מספר כרטיס:
          <input
            type="text"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            maxLength="16"
            placeholder="1234 5678 9012 3456"
          />
        </label>
        <label>
          תוקף:
          <input
            type="text"
            value={expiry}
            onChange={handleExpiryChange}
            maxLength="5"
            placeholder="MM/YY"
          />
        </label>
        <label>
          CVV:
          <input
            type="password"
            value={cvv}
            onChange={(e) => setCvv(e.target.value)}
            maxLength="3"
            placeholder="123"
          />
        </label>
        <label>
          מס תעודת זהות:
          <input
            type="text"
            value={idNumber}
            onChange={(e) => setIdNumber(e.target.value)}
            maxLength="9"
            placeholder="123456789"
          />
        </label>
        <button type="submit">שלם</button>
      </form>
      {message && <p className={error ? "message error" : "message"}>{message}</p>}
      <button className="back-home-btn" onClick={handleBackToHome}>חזרה לדף הבית 🏠</button>
    </div>
  );
};

export default Payment;
