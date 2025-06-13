import React from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";

// ייבוא קומפוננטות
import HomePage from "./components/HomePage";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import ResetPass from "./components/ResetPass";
import ContactUs from "./components/ContactUs";
import Meals from "./components/Meals";
import AddMeal from "./components/AddMeals";
import DeleteMeal from "./components/DeleteMeal";
import Orders from "./components/Orders";
import UpdateOrder from "./components/UpdateOrder";
import Admin from "./components/Admin";
import AdminUsers from "./components/AdminUsers";
import UpdateUser from "./components/UpdateUser";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/meals" element={<Meals />} />
        <Route path="/contactUs" element={<ContactUs />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/adminusers" element={<AdminUsers />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/deletemeal" element={<DeleteMeal />} />
        <Route path="/addmeal" element={<AddMeal />} />
        <Route path="/resetpass" element={<ResetPass />} />
        <Route path="/updateorder" element={<UpdateOrder />} />
         <Route path="/updateuser" element={<UpdateUser />} />
         

         
      </Routes>
    </BrowserRouter>

    
  );
}

export default App;
