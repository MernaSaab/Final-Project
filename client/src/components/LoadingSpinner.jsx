import React from 'react';
import './LoadingSpinner.css';

/**
 * Loading spinner component that can be used throughout the application
 * to indicate loading states
 */
const LoadingSpinner = ({ size = 'medium', text = 'טוען...' }) => {
  const sizeClass = `spinner-${size}`;
  
  return (
    <div className="spinner-container" dir="rtl">
      <div className={`spinner ${sizeClass}`}></div>
      {text && <p className="spinner-text">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
