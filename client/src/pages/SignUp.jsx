import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import "./SignUp.css";

const SignUp = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    age: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");

  const { register, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset errors
    setErrors({});
    setFormError("");

    // Validate form
    const validationErrors = {};
    if (!formData.first_name.trim())
      validationErrors.first_name = "שם פרטי נדרש";
    if (!formData.last_name.trim())
      validationErrors.last_name = "שם משפחה נדרש";
    if (!formData.email.trim()) {
      validationErrors.email = "אימייל נדרש";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      validationErrors.email = "אימייל לא תקין";
    }
    if (!formData.password) validationErrors.password = "סיסמה נדרשת";
    if (formData.password !== formData.confirmPassword) {
      validationErrors.confirmPassword = "הסיסמאות אינן תואמות";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Form is valid, proceed with signup
    try {
      // Create user data object for API
      const userData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone,
        age: formData.age,
        password: formData.password,
      };

      // Call register from auth context
      await register(userData);

      // Redirect to homepage (login page) with success message
      navigate("/", {
        state: {
          message: "הרשמה הושלמה בהצלחה! אנא התחבר כעת.",
        },
      });
    } catch (err) {
      // Handle registration error
      setFormError(err.message || "שגיאה בהרשמה. אנא נסה שוב.");
      console.error("Registration error:", err);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <h2>הרשמה לאתר</h2>
        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="first_name">שם פרטי</label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className={errors.first_name ? "error" : ""}
              disabled={loading}
            />
            {errors.first_name && (
              <span className="error-message">{errors.first_name}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="last_name">שם משפחה</label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className={errors.last_name ? "error" : ""}
              disabled={loading}
            />
            {errors.last_name && (
              <span className="error-message">{errors.last_name}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email">אימייל</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? "error" : ""}
              disabled={loading}
            />
            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="phone">טלפון</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="age">גיל</label>
            <input
              type="number"
              id="age"
              name="age"
              min="1"
              max="120"
              value={formData.age}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">סיסמה</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? "error" : ""}
              disabled={loading}
            />
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">אימות סיסמה</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? "error" : ""}
              disabled={loading}
            />
            {errors.confirmPassword && (
              <span className="error-message">{errors.confirmPassword}</span>
            )}
          </div>

          {/* Display form error or API error */}
          {(formError || error) && (
            <div className="form-error">{formError || error}</div>
          )}

          <button type="submit" className="signup-button" disabled={loading}>
            {loading ? "נרשם..." : "הירשם"}
          </button>
        </form>

        <div className="extra-links">
          <p>
            כבר יש לך חשבון? <Link to="/login">התחבר</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
