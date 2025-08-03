import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Protected route component that redirects to login if user is not authenticated
 * Can also restrict access based on user role (e.g., admin only)
 */
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="loading-container" dir="rtl">
        <p>טוען...</p>
      </div>
    );
  }

  // Check if user is authenticated
  if (!isAuthenticated()) {
    // Redirect to login page with return URL
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Check if route requires admin access
  if (adminOnly && !isAdmin()) {
    // Redirect to home page if user is not an admin
    return <Navigate to="/" replace />;
  }

  // Render the protected component
  return children;
};

export default ProtectedRoute;
