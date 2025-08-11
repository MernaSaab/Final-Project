import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./AdminNavbar.css";

const AdminNavbar = () => {
  const { logout } = useAuth();
  const location = useLocation();

  // Helper function to determine if a link is active
  const isActive = (path) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  return (
    <div className="admin-navbar-container">
      <div className="admin-navbar-title">
        <h1>מערכת ניהול </h1>
      </div>
      <nav className="admin-navbar">
        <Link to="/admin" className="admin-nav-link">
          דף הבית
        </Link>
        {/* Commented out orders link
        <Link 
          to="/admin/orders" 
          className={`admin-nav-link ${isActive('/admin/orders') ? 'active' : ''}`}
        >
          הזמנות
        </Link>
        */}
        <Link
          to="/admin/users"
          className={`admin-nav-link ${
            isActive("/admin/users") ? "active" : ""
          }`}
        >
          ניהול המשתמשים
        </Link>
        <Link
          to="/admin/meals"
          className={`admin-nav-link ${
            isActive("/admin/meals") ? "active" : ""
          }`}
        >
          מנות
        </Link>

        <Link to="/login" className="admin-nav-link" onClick={logout}>
          התנתק
        </Link>
      </nav>
      <div className="admin-navbar-bottom-border"></div>
    </div>
  );
};

export default AdminNavbar;
