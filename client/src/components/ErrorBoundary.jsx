import React, { Component } from 'react';

/**
 * Error Boundary component to catch JavaScript errors in child components
 * and display a fallback UI instead of crashing the whole app
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="error-boundary" dir="rtl">
          <h2>משהו השתבש</h2>
          <p>אנו מתנצלים על אי הנוחות. אנא נסה לרענן את הדף או לחזור מאוחר יותר.</p>
          <button 
            onClick={() => window.location.reload()}
            className="refresh-button"
          >
            רענן דף
          </button>
          {this.props.showDetails && (
            <details style={{ whiteSpace: 'pre-wrap', marginTop: '20px' }}>
              <summary>פרטי השגיאה</summary>
              <p>{this.state.error && this.state.error.toString()}</p>
              <p>מיקום השגיאה:</p>
              <p>{this.state.errorInfo && this.state.errorInfo.componentStack}</p>
            </details>
          )}
        </div>
      );
    }

    // If there's no error, render children normally
    return this.props.children;
  }
}

export default ErrorBoundary;
