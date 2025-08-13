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

  // Function to fetch dashboard statistics
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

      // Initialize default values
      let usersCount = 0;
      let mealsCount = 0;
      let ordersCount = 0;

      // Fetch all users and count them directly instead of using the count endpoint
      const getUserCount = async () => {
        try {
          // Fetch all users instead of just the count
          const response = await fetch('http://localhost:3001/users', {
            method: 'GET',
            headers,
            credentials: 'include'
          });
          
          if (response.ok) {
            const users = await response.json();
            console.log('Fetched users data:', users);
            // Return the length of the users array
            return Array.isArray(users) ? users.length : 0;
          } else {
            console.error('Error fetching users:', response.status);
            return 0;
          }
        } catch (error) {
          console.error('Error fetching users:', error);
          return 0;
        }
      };

      // Fetch meals count using fetch API
      const getMealsCount = async () => {
        try {
          const response = await fetch('http://localhost:3001/meals/count', {
            method: 'GET',
            headers,
            credentials: 'include'
          });
          
          if (response.ok) {
            const data = await response.json();
            return data.count || 0;
          }
        } catch (error) {
          console.error('Error fetching meals count:', error);
        }
        return 0;
      };

      // Fetch orders count using fetch API
      const getOrdersCount = async () => {
        try {
          const response = await fetch('http://localhost:3001/orders/count', {
            method: 'GET',
            headers,
            credentials: 'include'
          });
          
          if (response.ok) {
            const data = await response.json();
            return data.count || 0;
          }
        } catch (error) {
          console.error('Error fetching orders count:', error);
        }
        return 0;
      };

      // Fetch all counts in parallel
      const [users, meals, orders] = await Promise.all([
        getUserCount(),
        getMealsCount(),
        getOrdersCount()
      ]);

      console.log('Final counts from Promise.all:', { users, meals, orders });

      // Update state with fetched data
      const newStats = {
        users,
        meals,
        orders
      };
      
      console.log('Setting new stats:', newStats);
      setStats(newStats);

      // Set last login time
      setLastLogin(new Date().toLocaleString("he-IL"));
      
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

  // Fetch stats when component mounts and set up interval for real-time updates
  useEffect(() => {
    fetchStats();
    
    // Set up interval to refresh stats every 30 seconds
    const intervalId = setInterval(() => {
      fetchStats();
    }, 30000); // 30 seconds
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [isAdmin, logout, navigate]);

  return (
    <div className="admin-container">
      <AdminNavbar />
      <div className="admin-header">
        <div className="admin-badge">מנהל מערכת</div>
        <div className="admin-greeting">
          <h1>שלום {user.first_name} 👋</h1>
          <p>כאן תוכל/י לנהל את האתר בקלות</p>
          {lastLogin && <p className="last-login">כניסה אחרונה: {lastLogin}</p>}
        </div>
        <div style={{ width: "100px" }}></div> {/* Placeholder for balance */}
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="stats">
        {loading ? (
          <LoadingSpinner message="טוען נתונים..." />
        ) : (
          <>
            <div className="card">
              <h3>🧑‍♂️ משתמשים </h3>
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
            <div className="card">
              <h3>📬 צור קשר</h3>
              <p className="stat-number">הודעות</p>
              <Link to="/admin/messages" className="stat-action desktop-btn desktop-btn-primary">
                צפייה בהודעות
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
export default Admin;
