import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import AdminNavbar from "../components/AdminNavbar";
import "./Admin.css";

const Admin = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    users: 0,
    meals: 0,
    orders: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastLogin, setLastLogin] = useState(null);

  // Check if user is admin and redirect if not
  useEffect(() => {
    if (!isAdmin()) {
      navigate("/");
    }
  }, [isAdmin, navigate]);

  // Fetch dashboard statistics
  useEffect(() => {
    const fetchStats = async () => {
      if (!isAdmin()) {
        return; // Don't fetch stats if not admin
      }

      try {
        const token = sessionStorage.getItem("auth_token");
        if (!token) {
          console.error("No authentication token found");
          logout();
          navigate("/login");
          return;
        }

        setLoading(true);
        setError(null);

        // Prepare headers with authorization token
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };

        // Initialize default values in case any request fails
        let usersCount = 0;
        let mealsCount = 0;
        let ordersCount = 0;

        // Fetch users count
        try {
          console.log("Fetching users count...");
          const usersResponse = await fetch(
            "http://localhost:3001/users/count",
            { 
              method: 'GET',
              headers,
              credentials: 'include'
            }
          );
          
          console.log("Users response status:", usersResponse.status);
          
          if (usersResponse.ok) {
            const usersData = await usersResponse.json();
            usersCount = usersData.count || 0;
            console.log("Users count:", usersCount);
          } else {
            const errorText = await usersResponse.text();
            console.error("Error fetching users count:", usersResponse.status, errorText);
            
            // Handle unauthorized access
            if (usersResponse.status === 401 || usersResponse.status === 403) {
              console.log("Authentication failed, redirecting to login");
              logout();
              navigate("/login");
              return;
            }
          }
        } catch (userError) {
          console.error("Exception fetching users count:", userError);
        }

        // Fetch meals count
        try {
          console.log("Fetching meals count...");
          const mealsResponse = await fetch(
            "http://localhost:3001/meals/count",
            { 
              method: 'GET',
              headers,
              credentials: 'include'
            }
          );
          
          console.log("Meals response status:", mealsResponse.status);
          
          if (mealsResponse.ok) {
            const mealsData = await mealsResponse.json();
            mealsCount = mealsData.count || 0;
            console.log("Meals count:", mealsCount);
          } else {
            const errorText = await mealsResponse.text();
            console.error("Error fetching meals count:", mealsResponse.status, errorText);
          }
        } catch (mealError) {
          console.error("Exception fetching meals count:", mealError);
        }

        // Fetch orders count
        try {
          console.log("Fetching orders count...");
          const ordersResponse = await fetch(
            "http://localhost:3001/orders/count",
            { 
              method: 'GET',
              headers,
              credentials: 'include'
            }
          );
          
          console.log("Orders response status:", ordersResponse.status);
          
          if (ordersResponse.ok) {
            const ordersData = await ordersResponse.json();
            ordersCount = ordersData.count || 0;
            console.log("Orders count:", ordersCount);
          } else {
            const errorText = await ordersResponse.text();
            console.error("Error fetching orders count:", ordersResponse.status, errorText);
          }
        } catch (orderError) {
          console.error("Exception fetching orders count:", orderError);
        }

        // Update state with fetched data (using defaults if any request failed)
        setStats({
          users: usersCount,
          meals: mealsCount,
          orders: ordersCount,
        });

        // Set last login time
        setLastLogin(new Date().toLocaleString("he-IL"));
        
        console.log("Final stats:", { users: usersCount, meals: mealsCount, orders: ordersCount });
        
      } catch (err) {
        console.error("Error fetching admin statistics:", err);
        setError(err.message || "שגיאה בטעינת נתונים מהשרת");

        // Reset stats to zeros
        setStats({
          users: 0,
          meals: 0,
          orders: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [isAdmin, logout, navigate]);

  return (
    <div className="desktop-container admin-container">
      <AdminNavbar />
      <div className="admin-header">
        <div>
          <h1>שלום {user?.name || "מנהל"} 👋</h1>
          <p>כאן תוכל לנהל את האתר בקלות</p>
          {lastLogin && <p className="last-login">כניסה אחרונה: {lastLogin}</p>}
        </div>
        <div className="admin-badge">מנהל מערכת</div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="stats">
        {loading ? (
          <LoadingSpinner message="טוען נתונים..." />
        ) : (
          <>
            <div className="card">
              <h3>🧑‍♂️ משתמשים רשומים</h3>
              <p className="stat-number">{stats.users}</p>
              <Link to="/admin/users" className="stat-action desktop-btn desktop-btn-primary">
                ניהול משתמשים
              </Link>
            </div>
            <div className="card">
              <h3>🍱 סך מנות</h3>
              <p className="stat-number">{stats.meals}</p>
              <Link to="/admin/meals" className="stat-action desktop-btn desktop-btn-primary">
                ניהול מנות
              </Link>
            </div>
            <div className="card">
              <h3>🛒 הזמנות</h3>
              <p className="stat-number">{stats.orders}</p>
              <Link to="/admin/orders" className="stat-action desktop-btn desktop-btn-primary">צפייה בהזמנות</Link>
            </div>
          </>
        )}
      </div>

      <div className="admin-sections">
        <div className="admin-section">
          <h2>🍽️ ניהול מנות</h2>
          <div className="admin-actions">
            <Link to="/admin/meals" className="admin-link desktop-btn">
              <span className="icon">🖼️</span>
              ניהול מנות
            </Link>
            <Link to="/admin/add-meal" className="admin-link desktop-btn">
              <span className="icon">➕</span>
              הוספת מנה חדשה
            </Link>
          </div>
        </div>

        <div className="admin-section">
          <h2>👥 ניהול משתמשים</h2>
          <div className="admin-actions">
            <Link to="/admin/users" className="admin-link desktop-btn">
              <span className="icon">👤</span>
              ניהול משתמשים
            </Link>
          </div>
        </div>

        <div className="admin-section">
          <h2>📬 ניהול הודעות צור קשר</h2>
          <div className="admin-actions">
            <Link to="/admin/messages" className="admin-link desktop-btn">
              <span className="icon">📥</span>
              צפייה בהודעות שהתקבלו
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Admin;
