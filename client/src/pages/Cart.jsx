import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { mealApi, orderApi, orderMealApi } from '../services/api';
import './Cart.css';

const Cart = () => {
  const [message, setMessage] = useState('');
  const [vatRate, setVatRate] = useState(0.17); // Default fallback
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();
  const { cart, updateQty, removeItem, clearCart, totalItems, totalPrice } = useCart();
  const navigate = useNavigate();

  // Check if user is authenticated
  if (!isAuthenticated()) {
    navigate('/login', { state: { from: '/cart' } });
  }

  // Fetch VAT rate from database
  useEffect(() => {
    const fetchVATRate = async () => {
      try {
        const response = await fetch('http://localhost:3001/settings/vat_rate');
        if (response.ok) {
          const data = await response.json();
          setVatRate(data.setting_value);
          console.log('VAT rate loaded from database:', data.setting_value);
        } else {
          console.warn('Could not fetch VAT rate from database, using default 17%');
        }
      } catch (error) {
        console.error('Error fetching VAT rate:', error);
        console.warn('Using default VAT rate of 17%');
      } finally {
        setLoading(false);
      }
    };

    fetchVATRate();
  }, []);

  const handleRemoveFromCart = (itemId) => {
    removeItem(itemId);
  };
  
  const handleUpdateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      removeItem(itemId);
      return;
    }
    
    updateQty(itemId, newQuantity);
  };
  
  const getTotalPrice = () => {
    return totalPrice;
  };

  // Calculate VAT amounts using dynamic rate
  const getSubtotal = () => {
    return totalPrice;
  };

  const getVATAmount = () => {
    return Math.round(totalPrice * vatRate * 100) / 100;
  };

  const getTotalWithVAT = () => {
    return Math.round((totalPrice + getVATAmount()) * 100) / 100;
  };

  const getVATPercentage = () => {
    return Math.round(vatRate * 100);
  };
  
  // Checkout handler – moves to payment page; order will be created after הפרטים האישיים
  const checkout = () => {
    if (cart.length === 0) {
      setMessage('הסל שלך ריק');
      return;
    }

    // Pass cart, totalPrice, VAT info and rate to Payment page
    navigate('/payment', { 
      state: { 
        cart, 
        subtotal: getSubtotal(),
        vatRate: vatRate,
        vatAmount: getVATAmount(),
        totalPrice: getTotalWithVAT()
      } 
    });
  };

  // Show loading while fetching VAT rate
  if (loading) {
    return (
      <div className="cart-page">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <p>טוען נתוני מע"מ...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <header>
        <h1>🛒 סל הקניות שלך</h1>
        <nav>
          <Link to="/">דף הבית</Link>
          <Link to="/meals">תפריט</Link>
          <Link to="/cart">סל קניות</Link>
          <Link to="/contact">צור קשר</Link>
          {!isAuthenticated() && (
            <>
              <Link to="/login">התחברות</Link>
              <Link to="/signup">הרשמה</Link>
            </>
          )}
          {isAuthenticated() && (
            <Link to="#" onClick={() => {
              // Add logout functionality here
              // For now, just redirect to home
              navigate('/HomePage');
            }}>התנתק</Link>
          )}
        </nav>
      </header>

      {message && (
        <div className="message">
          {message}
        </div>
      )}

      <main className="cart-container">
        <h2>פריטים בסל הקניות</h2>
        
        {cart.length === 0 ? (
          <div className="empty-cart">
            <p>הסל שלך ריק</p>
            <Link to="/meals" className="continue-shopping">המשך לקנות</Link>
          </div>
        ) : (
          <>
            <div className="cart-items">
              <table className="cart-table">
                <thead>
                  <tr>
                    <th>מנה</th>
                    <th>מחיר</th>
                    <th>כמות</th>
                    <th>סה"כ</th>
                    <th>פעולות</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map(item => (
                    <tr key={item.id}>
                      <td className="meal-info">
                        <img 
                          src={item.imgUrl || `${process.env.PUBLIC_URL}/images/default-meal.png`} 
                          alt={item.name} 
                        />
                        <div>
                          <h3>{item.name}</h3>
                          <p>{item.description}</p>
                        </div>
                      </td>
                      <td className="price">₪{item.price}</td>
                      <td className="quantity">
                        <div className="quantity-controls">
                          <button onClick={() => handleUpdateQuantity(item.id, item.qty - 1)}>-</button>
                          <span>{item.qty}</span>
                          <button onClick={() => handleUpdateQuantity(item.id, item.qty + 1)}>+</button>
                        </div>
                      </td>
                      <td className="total">₪{item.price * item.qty}</td>
                      <td className="actions">
                        <button 
                          className="remove-button" 
                          onClick={() => handleRemoveFromCart(item.id)}
                        >
                          הסר
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="cart-summary">
              <div className="summary-row">
                <span>סה"כ פריטים:</span>
                <span>{totalItems}</span>
              </div>
              <div className="summary-row subtotal-row">
                <span>סה"כ לפני מע"מ:</span>
                <span>₪{getSubtotal()}</span>
              </div>
              <div className="summary-row vat-row">
                <span>מע"מ ({getVATPercentage()}%):</span>
                <span>₪{getVATAmount()}</span>
              </div>
              <div className="summary-row">
                <span>סה"כ לתשלום:</span>
                <span className="total-price">₪{getTotalWithVAT()}</span>
              </div>
              <button 
                className="checkout-button" 
                onClick={checkout}
              >
                לתשלום
              </button>
              <Link to="/meals" className="continue-shopping">המשך לקנות</Link>
            </div>
          </>
        )}
      </main>

      <footer>
        <p> 2025 - .</p>
      </footer>
    </div>
  );
};

export default Cart;
