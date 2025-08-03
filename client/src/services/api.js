/**
 * API service for connecting to the backend server
 * Provides methods for all API endpoints
 */
//חיבור בין הקליינט לשרת
//פעולות
import API_CONFIG from "../config/api.config";

const API_BASE_URL = API_CONFIG.BASE_URL;

// Generic request handler with error management
const apiRequest = async (endpoint, method = "GET", data = null) => {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
};

// User related API calls
export const userApi = {
  // Get all users
  getAllUsers: () => apiRequest("/users"),

  // Get user by ID
  getUserById: (userId) => apiRequest(`/users/${userId}`),

  // Create new user
  createUser: (userData) => apiRequest("/users", "POST", userData),

  // Update user
  updateUser: (userId, userData) =>
    apiRequest(`/users/${userId}`, "PUT", userData),

  // Delete user
  deleteUser: (userId) => apiRequest(`/users/${userId}`, "DELETE"),
};

// Meal related API calls
export const mealApi = {
  // Get all meals
  getAllMeals: () => apiRequest("/meals"),
    // Create full order (meals array + user_id + status)
  createFullOrder: (data) => apiRequest("/order_meal/full", "POST", data),


  // Get meal by ID
  getMealById: (mealId) => apiRequest(`/meals/${mealId}`),

  // Create new meal
  createMeal: (mealData) => apiRequest("/meals", "POST", mealData),

  // Update meal
  updateMeal: (mealId, mealData) =>
    apiRequest(`/meals/${mealId}`, "PUT", mealData),

  // Delete meal
  deleteMeal: (mealId) => apiRequest(`/meals/${mealId}`, "DELETE"),
};


// Order related API calls
export const orderApi = {
  // Get all orders
  getAllOrders: () => apiRequest("/orders"),

  // Get order by ID
  getOrderById: (orderId) => apiRequest(`/orders/${orderId}`),

  // Create new order
  createOrder: (orderData) => apiRequest("/orders", "POST", orderData),

  // Update order
  updateOrder: (orderId, orderData) =>
    apiRequest(`/orders/${orderId}`, "PUT", orderData),

  // Delete order
  deleteOrder: (orderId) => apiRequest(`/orders/${orderId}`, "DELETE"),
};

// OrderMeal related API calls
export const orderMealApi = {
  // Get all order meals
  getAllOrderMeals: () => apiRequest("/order_meal"),

  // Get order meal by order ID
  getOrderMealById: (orderId) => apiRequest(`/order_meal/${orderId}`),

  // Create new order meal
  createOrderMeal: (orderMealData) => apiRequest("/order_meal", "POST", orderMealData),

  // Update order meal
  updateOrderMeal: (orderId, orderMealData) =>
    apiRequest(`/order_meal/${orderId}`, "PUT", orderMealData),

  // Delete order meal
  deleteOrderMeal: (orderId) => apiRequest(`/order_meal/${orderId}`, "DELETE"),
};

// Category related API calls
export const categoryApi = {
  // Get all categories
  getAllCategories: () => apiRequest("/categories"),

  // Get category by ID
  getCategoryById: (categoryId) => apiRequest(`/categories/${categoryId}`),

  // Get meals by category
  getMealsByCategory: (categoryId) =>
    apiRequest(`/categories/${categoryId}/meals`),
};

// Admin related API calls
export const adminApi = {
  // Admin login
  login: (credentials) => apiRequest("/admin/login", "POST", credentials),

  // Get admin dashboard data
  getDashboardData: () => apiRequest("/admin/dashboard"),
};





export default {
  userApi,
  mealApi,
  orderApi,
  categoryApi,
  adminApi,
};
