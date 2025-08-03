import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

const Header = () => {
  return (
    <header className="main-header">
      <div className="container">
        <div className="logo">Healthy LifeStyle By Melana</div>
        <nav className="nav">
          <Link to="/">בית</Link>
          <Link to="/meals">מנות</Link>
          <Link to="/about">אודות</Link>
          <Link to="/contact">צור קשר</Link>
            
        </nav>
      </div>
    </header>
  );
};

export default Header;
