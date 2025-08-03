import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './UserProfile.css';

const UserProfile = () => {
  const userId = localStorage.getItem('user_id');
  const navigate = useNavigate();
  const [user, setUser] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: ''
  });
const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get(`http://localhost:3001/users/${userId}`)
      .then(res => setUser(res.data))
      .catch(console.error);
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3001/users/${userId}`, user);
      setMessage('הפרטים נשמרו בהצלחה');
    } catch (err) {
      console.error(err);
      setMessage('אירעה שגיאה בשמירה');
    }
  };

  return (
    <div className="profile-container">
      <button className="back-btn" onClick={() => navigate('/')}>← חזרה לדף הבית</button>
      <h2>פרטים אישיים</h2>
      {message && <div className="msg">{message}</div>}
      <form className="profile-form" onSubmit={handleSubmit}>
        <label>
          שם פרטי:
          <input name="first_name" value={user.first_name} onChange={handleChange} required />
        </label>
        <label>
          שם משפחה:
          <input name="last_name" value={user.last_name} onChange={handleChange} required />
        </label>
        <label>
          אימייל:
          <input type="email" name="email" value={user.email} onChange={handleChange} required />
        </label>
        <label>
          טלפון:
          <input name="phone" value={user.phone} onChange={handleChange} />
        </label>
        <label>
          כתובת:
          <input name="address" value={user.address} onChange={handleChange} />
        </label>
        <button type="submit">שמירת שינויים</button>
      </form>
    </div>
  );
};

export default UserProfile;
