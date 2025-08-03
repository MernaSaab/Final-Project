import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

import "./App.css";

// Import components
import HomePage from "./components/pages/HomePage.jsx";
import Login from "./components/pages/Login.jsx";
import SignUp from "./components/pages/SignUp.jsx";
import Meals from "./components/pages/Meals.jsx";
import ContactUs from "./components/pages/ContactUs.jsx";
import Admin from "./components/pages/Admin.jsx";
import AdminUsers from "./components/pages/AdminUsers.jsx";
import AddMeal from "./components/pages/AddMeal.jsx";
import DeleteMeal from "./components/pages/DeleteMeal.jsx";
import Orders from "./pages/Orders.jsx";
import ResetPass from "./components/pages/ResetPass.jsx";
import UpdateOrder from "./components/pages/UpdateOrder.jsx";
import UpdateUser from "./components/pages/UpdateUser.jsx";
import AdminMessages from "./pages/AdminMessages";
import UserProfile from './pages/UserProfile';
import SideMenu from './components/SideMenu';
import ReceiptPage from './pages/ReceiptPage.jsx';
import AdminOrders from './pages/AdminOrders.jsx';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  
  // Only show SideMenu on client pages, not admin pages
  const showSideMenu = isAuthenticated() && !location.pathname.startsWith('/admin');

  return (
    <>
      {showSideMenu && <SideMenu />}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/meals" element={<Meals />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/admin/messages" element={<AdminMessages />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/add-meal" element={<AddMeal />} />
        <Route path="/admin/delete-meal" element={<DeleteMeal />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/receipt/:orderId" element={<ReceiptPage />} />
        <Route path="/test-receipt" element={<ReceiptPage />} />
        <Route path="/reset-password" element={<ResetPass />} />
        <Route path="/update-order" element={<UpdateOrder />} />
        <Route path="/update-user" element={<UpdateUser />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        {/* Catch-all route for debugging */}
        <Route path="*" element={<div style={{padding: '20px', textAlign: 'center', direction: 'rtl'}}>
          <h2>דף לא נמצא - 404</h2>
          <p>הנתיב המבוקש לא קיים: {location.pathname}</p>
          <button onClick={() => window.history.back()}>חזור</button>
        </div>} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
