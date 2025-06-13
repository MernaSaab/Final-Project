import React from "react";
import { Link } from "react-router-dom";

import "../styles/HomePage.css";

export default function Navbar() {
  return (
    <nav className="nav">
      <Link to="/homepage">דף הבית</Link>
      <Link to="/login">התחברות</Link>
      <Link to="/signup">הרשמה</Link>
      <Link to="/meals">קניית מנות</Link>
      <Link to="contactUs">צור קשר</Link>
    </nav>
  );
}
