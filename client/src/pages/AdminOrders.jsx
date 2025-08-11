// src/pages/AdminOrders.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Admin.css";
import { Link } from "react-router-dom";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [error, setError] = useState(null);
  
  // State for custom modals
  const [itemsModalIsOpen, setItemsModalIsOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [itemsModalTitle, setItemsModalTitle] = useState("");
  
  // State for user filtering
  const [userFilter, setUserFilter] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:3001/orders/all");
      setOrders(res.data);
      setFilteredOrders(res.data);
    } catch (err) {
      setError("שגיאה בטעינת ההזמנות");
      console.error(err);
    }
  };
  
  // Apply all filters (search, status, and user)
  const applyFilters = () => {
    // Make sure we have orders to filter
    if (!orders || orders.length === 0) {
      setFilteredOrders([]);
      return;
    }
    
    // Start with a fresh copy of orders
    let filtered = [...orders];
    
    // Apply user filter if exists
    if (userFilter) {
      console.log('Applying user filter for:', userFilter);
      filtered = filtered.filter(order => {
        // Check if the order belongs to this user by comparing names
        const orderFullName = `${order.first_name || ''} ${order.last_name || ''}`.trim().toLowerCase();
        const userFullName = `${userFilter.first_name || ''} ${userFilter.last_name || ''}`.trim().toLowerCase();
        return orderFullName === userFullName;
      });
    }
    
    // Apply search term filter if exists
    if (searchTerm && searchTerm.trim()) {
      const searchValue = searchTerm.trim().toLowerCase();
      filtered = filtered.filter(order => {
        // Make sure order_id exists and convert to string
        const orderIdStr = order.order_id ? order.order_id.toString() : '';
        const orderIdMatch = orderIdStr.includes(searchValue);
        
        // Safely concatenate names
        const fullName = `${order.first_name || ''} ${order.last_name || ''}`.trim().toLowerCase();
        const nameMatch = fullName.includes(searchValue);
        
        return orderIdMatch || nameMatch;
      });
    }
    
    // Apply status filter if not 'all'
    if (statusFilter && statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }
    
    // Update state with filtered results
    setFilteredOrders(filtered);
    
    // Debug
    console.log('Filter applied:', { 
      total: orders.length, 
      filtered: filtered.length, 
      searchTerm, 
      statusFilter,
      userFilter: userFilter ? `${userFilter.first_name} ${userFilter.last_name}` : 'none'
    });
  };
  
  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    // Apply filters immediately
    applyFilters();
  };
  
  // Handle status filter change
  const handleStatusFilterChange = (e) => {
    const value = e.target.value;
    console.log('Status filter changed to:', value);
    setStatusFilter(value);
    // Apply filters immediately
    applyFilters();
  };
  
  // Function to open modal with order items
  const openItemsModal = (order) => {
    // Parse items string to array of items
    // Assuming items are in format like "שייק ירוק x 1, כתומות x 2, שייק ירוק x 2"
    const itemsString = order.items || '';
    
    // Split by comma and clean up
    const itemsArray = itemsString.split(',')
      .map(item => item.trim())
      .filter(item => item.length > 0);
    
    setSelectedItems(itemsArray);
    setItemsModalTitle(`פריטי הזמנה #${order.order_id}`);
    setItemsModalIsOpen(true);
  };
  
  // Function to close items modal
  const closeItemsModal = () => {
    setItemsModalIsOpen(false);
    setSelectedItems([]);
  };
  
  // Function to filter orders by user
  const filterByUser = (user) => {
    if (!user) {
      // Clear filter
      console.log('Clearing user filter');
      setUserFilter(null);
      
      // Apply filters immediately with the current orders
      const filtered = [...orders];
      
      // Apply any other active filters
      let finalFiltered = filtered;
      
      if (searchTerm && searchTerm.trim()) {
        const searchValue = searchTerm.trim().toLowerCase();
        finalFiltered = finalFiltered.filter(order => {
          const orderIdStr = order.order_id ? order.order_id.toString() : '';
          const orderIdMatch = orderIdStr.includes(searchValue);
          const fullName = `${order.first_name || ''} ${order.last_name || ''}`.trim().toLowerCase();
          const nameMatch = fullName.includes(searchValue);
          return orderIdMatch || nameMatch;
        });
      }
      
      if (statusFilter && statusFilter !== 'all') {
        finalFiltered = finalFiltered.filter(order => order.status === statusFilter);
      }
      
      // Update filtered orders immediately
      setFilteredOrders(finalFiltered);
      return;
    }
    
    // Set user filter
    console.log('Setting user filter to:', user);
    setUserFilter(user);
    
    // Filter orders immediately
    const userFullName = `${user.first_name || ''} ${user.last_name || ''}`.trim().toLowerCase();
    
    // Start with all orders
    let filtered = orders.filter(order => {
      const orderFullName = `${order.first_name || ''} ${order.last_name || ''}`.trim().toLowerCase();
      return orderFullName === userFullName;
    });
    
    // Apply any other active filters
    if (searchTerm && searchTerm.trim()) {
      const searchValue = searchTerm.trim().toLowerCase();
      filtered = filtered.filter(order => {
        const orderIdStr = order.order_id ? order.order_id.toString() : '';
        const orderIdMatch = orderIdStr.includes(searchValue);
        const fullName = `${order.first_name || ''} ${order.last_name || ''}`.trim().toLowerCase();
        const nameMatch = fullName.includes(searchValue);
        return orderIdMatch || nameMatch;
      });
    }
    
    if (statusFilter && statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }
    
    // Update filtered orders immediately
    setFilteredOrders(filtered);
  };
  
  // Function to get status class for styling
  const getStatusClass = (status) => {
    switch (status) {
      case 'pending':
        return 'pending';
      case 'processing':
        return 'processing';
      case 'delivered':
        return 'delivered';
      case 'canceled':
        return 'canceled';
      default:
        return '';
    }
  };

  // Update status
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      console.log(`Updating order ${orderId} status to ${newStatus}`);
      await axios.patch(`http://localhost:3001/orders/${orderId}/status`, { status: newStatus });
      
      // Update local state
      const updatedOrders = orders.map(o => 
        o.order_id === orderId ? { ...o, status: newStatus } : o
      );
      
      setOrders(updatedOrders);
      
      // Re-apply filters with the updated orders
      // This will run after the state update
    } catch (err) {
      console.error('Error updating order status:', err);
      alert('שגיאה בעדכון הסטטוס');
    }
  };

  // Fetch orders on component mount
  useEffect(() => {
    fetchOrders();
  }, []);
  
  // Re-apply filters when orders, searchTerm, or statusFilter change
  useEffect(() => {
    applyFilters();
  }, [orders, searchTerm, statusFilter, userFilter]);
  
  // This ensures filters are properly applied after state updates

  return (
    <div className="admin-container">
      <h1 className="main-header">📦 הזמנות מהלקוחות</h1>
      {error && <div className="error-message">{error}</div>}

      <div className="admin-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>
            {userFilter 
              ? `רשימת הזמנות - ${userFilter.first_name} ${userFilter.last_name}` 
              : 'רשימת הזמנות'}
          </h2>
          {userFilter && (
            <div>
              <button 
                onClick={() => filterByUser(null)}
                style={{
                  padding: '5px 10px',
                  backgroundColor: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  marginRight: '10px',
                  fontWeight: 'bold'
                }}
              >
                חזרה לכל ההזמנות
              </button>
            </div>
          )}
        </div>
        
        {/* Filter controls */}
        <div className="filters-container" style={{ 
          margin: "1rem 0", 
          display: "flex", 
          flexDirection: "row",
          justifyContent: "space-between", 
          alignItems: "flex-end", /* Changed from center to flex-end to lower the search field */
          gap: "20px"
        }}>
          {/* Status filter */}
          <div className="status-filter-container" style={{ 
            display: "flex",
            alignItems: "center",
            whiteSpace: "nowrap"
          }}>
            <label htmlFor="status-filter" style={{ marginLeft: "0.5rem", marginRight: "0.5rem" }}>סינון לפי סטטוס: </label>
            <select 
              id="status-filter"
              value={statusFilter}
              onChange={handleStatusFilterChange}
              style={{
                padding: "0.5rem",
                borderRadius: "4px",
                border: "1px solid #ccc"
              }}
            >
              <option value="all">הכל</option>
              <option value="pending">pending</option>
              <option value="processing">processing</option>
              <option value="delivered">delivered</option>
              <option value="canceled">canceled</option>
            </select>
          </div>
          
          {/* Search input */}
          <div className="search-container" style={{ marginBottom: "2px" }}>
            <input
              type="text"
              placeholder="חיפוש לפי שם משתמש או מספר הזמנה"
              value={searchTerm}
              onChange={handleSearchChange}
              style={{
                padding: "0.5rem",
                width: "300px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                direction: "rtl",
                position: "relative",
                top: "2px" /* Added to lower the search field slightly */
              }}
            />
          </div>
        </div>
        {orders.length === 0 ? (
          <p>אין הזמנות להצגה.</p>
        ) : filteredOrders.length === 0 ? (
          <p>לא נמצאו הזמנות התואמות לחיפוש.</p>
        ) : (
          <table className="orders-table" style={{ borderCollapse: 'collapse', width: '100%', border: '1px solid black' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid black', padding: '8px' }}>מספר הזמנה</th>
                <th style={{ border: '1px solid black', padding: '8px' }}>תאריך</th>
                <th style={{ border: '1px solid black', padding: '8px' }}>שם משתמש</th>
                <th style={{ border: '1px solid black', padding: '8px' }}>פריטים</th>
                <th style={{ border: '1px solid black', padding: '8px' }}>סטטוס</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => {
                // Define row background color based on status
                let rowStyle = {};
                
                // Apply color coding only when viewing all orders (not filtered by status)
                if (statusFilter === 'all') {
                  switch(order.status) {
                    case 'pending':
                      rowStyle = { backgroundColor: '#ffcccc' }; // Dark red
                      break;
                    case 'processing':
                      rowStyle = { backgroundColor: '#ffddaa' }; // Dark orange
                      break;
                    case 'delivered':
                      rowStyle = { backgroundColor: '#ccffcc' }; // Dark green
                      break;
                    case 'canceled':
                      rowStyle = { backgroundColor: '#e0e0e0' }; // Gray
                      break;
                  }
                }
                
                return (
                  <tr 
                    key={order.order_id} 
                    style={{
                      ...rowStyle,
                      borderBottom: '1px solid black'
                    }}
                  >
                    <td style={{ border: '1px solid black', padding: '8px' }}>{order.order_id}</td>
                    <td style={{ border: '1px solid black', padding: '8px' }}>{order.order_date ? new Date(order.order_date).toLocaleDateString('he-IL') : '—'}</td>
                    <td style={{ border: '1px solid black', padding: '8px' }}>
                      <button 
                        onClick={() => filterByUser({
                          user_id: order.user_id,
                          first_name: order.first_name,
                          last_name: order.last_name
                        })}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#0066cc',
                          textDecoration: 'underline',
                          cursor: 'pointer',
                          padding: '0',
                          font: 'inherit',
                          textAlign: 'right'
                        }}
                      >
                        {`${order.first_name || ''} ${order.last_name || ''}`.trim() || '—'}
                      </button>
                    </td>
                    <td style={{ border: '1px solid black', padding: '8px' }}>
                      <button 
                        onClick={() => openItemsModal(order)}
                        style={{
                          padding: '5px 10px',
                          backgroundColor: '#4CAF50',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontWeight: 'bold'
                        }}
                      >
                        הצג פריטים
                      </button>
                    </td>
                    <td style={{ border: '1px solid black', padding: '8px' }}>
                      <select 
                        value={order.status} 
                        onChange={e => handleStatusChange(order.order_id, e.target.value)}
                        style={{ 
                          padding: '0.25rem',
                          borderRadius: '4px',
                          border: '1px solid #ccc'
                        }}
                      >
                        <option value="pending">pending</option>
                        <option value="processing">processing</option>
                        <option value="delivered">delivered</option>
                        <option value="canceled">canceled</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <div style={{ marginTop: "2rem" }}>
        <Link to="/admin" className="admin-link">⬅ חזרה לניהול</Link>
      </div>
      
      {/* Custom Modal for displaying order items */}
      {itemsModalIsOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            width: '400px',
            maxHeight: '80vh',
            borderRadius: '8px',
            padding: '20px',
            direction: 'rtl',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
          }}>
            <h2 style={{ borderBottom: '1px solid #ccc', paddingBottom: '10px', marginTop: '0' }}>{itemsModalTitle}</h2>
            <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
              {selectedItems.length > 0 ? (
                <ul style={{ listStyleType: 'none', padding: '0' }}>
                  {selectedItems.map((item, index) => (
                    <li 
                      key={index} 
                      style={{ 
                        padding: '8px 0', 
                        borderBottom: index < selectedItems.length - 1 ? '1px solid #eee' : 'none',
                        fontSize: '16px'
                      }}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>אין פריטים להצגה</p>
              )}
            </div>
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button 
                onClick={closeItemsModal}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                סגור
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* No modal needed anymore - filtering happens in the main table */}
    </div>
  );
};

export default AdminOrders;