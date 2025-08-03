import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ResetPass.css';

const ResetPass = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // In a real app, you would make an API call to request a password reset
    console.log('Password reset requested for:', email);
    
    // Show success message
    setMessage('הוראות לאיפוס הסיסמה נשלחו לכתובת האימייל שלך');
    
    // Clear form
    setEmail('');
  };

  return (
    <div className="reset-pass-page">
      <div className="reset-container">
        <h2>🔐 שחזור סיסמה</h2>
        <p>הכנס את כתובת האימייל שלך ונשלח אליך קישור לאיפוס הסיסמה</p>
        
        {message && <div className="success-message">{message}</div>}
        
        <form className="reset-form" onSubmit={handleSubmit}>
          <label>
            אימייל:
            <input 
              type="email" 
              placeholder="example@email.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </label>

          <button type="submit">שלח קישור לאיפוס</button>
        </form>

        <div className="back-links">
          <Link to="/login" className="back-btn">⬅️ חזרה להתחברות</Link>
          <Link to="/" className="back-btn">🏠 דף הבית</Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPass;
