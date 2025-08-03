import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
  const location = useLocation();
  
  // Only show our custom header on login and signup pages
  // All other pages already have their own navigation
  const showHeader = location.pathname === '/login' || 
                    location.pathname === '/signup' || 
                    location.pathname === '/reset-password';
  
  return (
    <>
      {showHeader && <Header />}
      {children || <Outlet />}
      <Footer />
    </>
  );
};

export default Layout;
