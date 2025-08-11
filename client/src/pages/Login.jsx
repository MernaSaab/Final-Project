import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const { login, loading, error: authError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Check for success message from registration
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clear the message after 5 seconds
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  // Get the redirect path from location state or default to homepage
  const from = location.state?.from || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Login form submitted");

    // Reset errors
    setFormError("");

    // Simple validation
    if (!email || !password) {
      setFormError("אנא הזן אימייל וסיסמה");
      console.log("Validation failed: missing email or password");
      return;
    }

    console.log("Attempting login with:", { email });

    try {
      // Call login from auth context
      console.log("Calling login function from AuthContext");
      const user = await login(email, password);
      console.log("Login successful:", user);
      localStorage.setItem('user_id', user.user_id);
      
      // Check if user is admin and redirect accordingly
      if (user.user_type === "admin") {
        console.log("Admin user detected, redirecting to admin dashboard");
        navigate("/admin");
      } else {
        console.log("Regular user detected, redirecting to homepage");
        navigate("/");
      }
      
      // Note: Admin users can still access the admin page via the admin tab in the navbar
    } catch (err) {
      console.error("Login error:", err);
      setFormError(err.message || "שגיאה בהתחברות. אנא נסה שוב.");
    }
  };

  return (
    <div className="login-container">
      
      <form onSubmit={handleSubmit} className="login-form">
              <h2>🔐 התחברות לאתר</h2>

        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}
        {(formError || authError) && (
          <div className="form-error">{formError || authError}</div>
        )}

        <div className="form-group">
          <label htmlFor="email">אימייל</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">סיסמה</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />
        </div>

        <button type="submit" className="login-button" disabled={loading}>
          {loading ? "מתחבר..." : "התחבר"}
        </button>

        <div className="extra-links">
          <Link to="/reset-password">שכחת סיסמה?</Link> | 
          <Link to="/signup">להרשמה</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;