import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Import pages
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ContactUs from './pages/ContactUs';
import Meals from './pages/Meals';
import HomePage from './pages/HomePage';
import Admin from './pages/Admin';
import AdminUsers from './pages/AdminUsers';
import AdminMealsList from './pages/AdminMealsList';
import AddMeal from './pages/AddMeal';
import DeleteMeal from './pages/DeleteMeal';
import EditMeal from './pages/EditMeal';
import Orders from './pages/Orders';
import UpdateOrder from './pages/UpdateOrder';
import UpdateUser from './pages/UpdateUser';
import ResetPass from './pages/ResetPass';
import Cart from './pages/Cart';
import Payment from './pages/Payment';
import AdminOrders from "./pages/AdminOrders";
import UserProfile from './pages/UserProfile';
import ReceiptPage from './pages/ReceiptPage';

// Import layout components
import Layout from './components/Layout';

// Import contexts
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import ProtectedRoute from './components/ProtectedRoute';

// Import example components
import ApiExample from './examples/ApiExample';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/reset-password" element={<ResetPass />} />
            <Route path="/admin/orders" element={<ProtectedRoute><AdminOrders /></ProtectedRoute>} />
            
            {/* Protected user routes */}
            <Route path="/orders" element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            } />
            <Route path="/receipt/:orderId" element={
              <ProtectedRoute>
                <ReceiptPage />
              </ProtectedRoute>
            } />

            <Route path="/meals" element={
              <ProtectedRoute>
                <Meals />
              </ProtectedRoute>
            } />
            
            <Route path="/cart" element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            } />
            <Route path="/payment" element={
              <ProtectedRoute>
                <Payment />
              </ProtectedRoute>
            } />
            
            {/* Protected admin routes */}
            <Route path="/admin" element={
              <ProtectedRoute adminOnly={true}>
                <Admin />
              </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute adminOnly={true}>
                <AdminUsers />
              </ProtectedRoute>
            } />
            <Route path="/admin/meals" element={
              <ProtectedRoute adminOnly={true}>
                <AdminMealsList />
              </ProtectedRoute>
            } />
            <Route path="/admin/add-meal" element={
              <ProtectedRoute adminOnly={true}>
                <AddMeal />
              </ProtectedRoute>
            } />
            <Route path="/admin/delete-meal" element={
              <ProtectedRoute adminOnly={true}>
                <DeleteMeal />
              </ProtectedRoute>
            } />
            <Route path="/admin/edit-meal/:id" element={
              <ProtectedRoute adminOnly={true}>
                <EditMeal />
              </ProtectedRoute>
            } />
            <Route path="/admin/orders" element={
              <ProtectedRoute adminOnly={true}>
                <Orders />
              </ProtectedRoute>
            } />
            <Route path="/admin/update-order" element={
              <ProtectedRoute adminOnly={true}>
                <UpdateOrder />
              </ProtectedRoute>
            } />
            <Route path="/admin/update-user" element={
              <ProtectedRoute adminOnly={true}>
                <UpdateUser />
              </ProtectedRoute>
            } />

            
            {/* Example API component for development */}
            <Route path="/api-example" element={<ApiExample />} />
          </Route>
        </Routes>
      </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
