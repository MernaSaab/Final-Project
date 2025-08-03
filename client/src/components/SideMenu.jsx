// SideMenu.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './SideMenu.css';

const SideMenu = () => {
  const [open, setOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div>
      <div className={`menu-toggle ${open ? 'open' : ''}`} onClick={() => setOpen(!open)}>
  <div className="menu-icon">
    <span></span>
    <span></span>
    <span></span>
  </div>
  <span className="menu-title">תפריט</span>
</div>

     


    <div className={`side-menu ${open ? 'open' : ''}`}>
        
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li><Link to="/profile" onClick={() => setOpen(false)}>פרטים אישיים</Link></li>
          <li><Link to="/orders" onClick={() => setOpen(false)}>ההזמנות שלי</Link></li>
          <li><button style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer' }} onClick={handleLogout}>התנתקות</button></li>
        </ul>
      </div>
    </div>
    
  );
};

export default SideMenu;