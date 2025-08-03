/**
 * Authentication service for user login, registration, and session management
 */
//הקובץ אחראי על - Login, Register, ניהול

import API_CONFIG from "../config/api.config";

const AUTH_TOKEN_KEY = "auth_token";
const USER_DATA_KEY = "user_data";

//פונקציית-עזר כללית לביצוע קריאות - fetch
const authRequest = async (endpoint, method = "POST", data = null) => {
  console.log(`authService: Making ${method} request to ${endpoint}`, data);

  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  //שליפה של הטוקן מה-session אם קיים
  const token = getToken();
  if (token) {
    options.headers["Authorization"] = `Bearer ${token}`;
  }

  //הרכבת כתובת-ה-API המלאה.
  try {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;
    console.log(`authService: Fetching from ${url}`, options);

    //ביצוע הקריאה האסינכרונית.
    const response = await fetch(url, options);
    console.log(`authService: Response status:`, response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(
        "authService: Request failed with status",
        response.status,
        errorData
      );
      throw new Error(errorData.message || `שגיאת שרת: ${response.status}`);
    }

    //קריאת גוף-התשובה (JSON) במקרה הצלחה.
    const responseData = await response.json();
    console.log("authService: Request successful", responseData);
    return responseData;
  } catch (error) {
    console.error("authService: Request failed:", error);
    throw error;
  }
};

// Save auth token and user data to session storage
const setSession = (token, userData) => {
  sessionStorage.setItem(AUTH_TOKEN_KEY, token);
  sessionStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
};

// Clear auth token and user data from session storage

const clearSession = () => {
  sessionStorage.removeItem(AUTH_TOKEN_KEY);
  sessionStorage.removeItem(USER_DATA_KEY);
};

// Get auth token from session storage

const getToken = () => {
  return sessionStorage.getItem(AUTH_TOKEN_KEY);
};

// Get user data from session storage
const getUserData = () => {
  const userData = sessionStorage.getItem(USER_DATA_KEY);
  return userData ? JSON.parse(userData) : null;
};

// Check if user is authenticated
//returns true/false
const isAuthenticated = () => {
  return !!getToken();
};

// Check if user has admin role
const isAdmin = () => {
  const userData = getUserData();
  return userData && userData.user_type === "admin";
};

//יצירת אובייקט-שירות שיאוגד את כל המתודות החיצוניות.
// Authentication service
const authService = {
  // User login
  login: async (email, password) => {
    console.log("authService.login: Starting login process", { email });
    try {
      const data = await authRequest("/auth/login", "POST", {
        email,
        password,
      });
      console.log("authService.login: Login successful", data);
      if (data.token && data.user) {
        console.log("authService.login: Setting session");
        setSession(data.token, data.user);
      } else {
        console.warn(
          "authService.login: Missing token or user data in response"
        );
      }
      return data;
    } catch (error) {
      console.error("authService.login: Login failed", error);
      throw error;
    }
  },

  // User registration
  register: async (userData) => {
    const data = await authRequest("/auth/register", "POST", userData);
    return data;
  },

  // User logout
  logout: () => {
    clearSession();
  },

  // Password reset request
  //שולח בקשת-שחזור סיסמה
  resetPassword: async (email) => {
    return await authRequest("/auth/reset-password", "POST", { email });
  },

  // Get current user
  getCurrentUser: () => {
    return getUserData();
  },

  // Check if user is authenticated
  isAuthenticated,

  // Check if user has admin role
  isAdmin,
};

export default authService;
