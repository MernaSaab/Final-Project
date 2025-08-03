import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/auth';

// Create the authentication context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state from session storage
  useEffect(() => {
    const initAuth = () => {
      try {
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        }
      } catch (err) {
        console.error('Error initializing auth:', err);
        setError('שגיאה באתחול המשתמש');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    console.log('AuthContext: login function called', { email });
    setLoading(true);
    setError(null);
    
    try {
      console.log('AuthContext: calling authService.login');
      const data = await authService.login(email, password);
      console.log('AuthContext: login successful', data);
      setUser(data.user);
      return data.user;
    } catch (err) {
      console.error('AuthContext: login error', err);
      setError(err.message || 'שגיאה בהתחברות');
      throw err;
    } finally {
      setLoading(false);
      console.log('AuthContext: login process completed');
    }
  };

  // Register function
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await authService.register(userData);
      return data;
    } catch (err) {
      setError(err.message || 'שגיאה בהרשמה');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    authService.logout();
    setUser(null);
  };

  // Reset password function
  const resetPassword = async (email) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await authService.resetPassword(email);
      return data;
    } catch (err) {
      setError(err.message || 'שגיאה באיפוס סיסמה');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return authService.isAuthenticated();
  };

  // Check if user is admin
  const isAdmin = () => {
    return authService.isAdmin();
  };

  // Context value
  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    resetPassword,
    isAuthenticated,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
