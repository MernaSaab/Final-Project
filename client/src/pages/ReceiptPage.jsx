import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Receipt from '../components/Receipt';

const ReceiptPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [vatRate, setVatRate] = useState(17);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReceiptData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get auth token using the correct key name from auth service
        const token = sessionStorage.getItem('auth_token');
        if (!token) {
          setError('נדרש להתחבר כדי לצפות בקבלה');
          setLoading(false);
          return;
        }

        const config = {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          withCredentials: true
        };

        // Fetch order details, order items, and VAT rate in parallel
        const [orderResponse, itemsResponse, vatResponse] = await Promise.all([
          axios.get(`http://localhost:3001/orders/${orderId}`, config),
          axios.get(`http://localhost:3001/orders/${orderId}/items`, config),
          axios.get('http://localhost:3001/settings/vat_rate', config)
        ]);

        setOrderData(orderResponse.data);
        setOrderItems(itemsResponse.data);
        setVatRate(vatResponse.data.vat_rate || 17);

      } catch (err) {
        console.error('Error fetching receipt data:', err);
        if (err.response?.status === 401) {
          setError('נדרש להתחבר כדי לצפות בקבלה');
        } else if (err.response?.status === 404) {
          setError('הזמנה לא נמצאה');
        } else {
          setError('שגיאה בטעינת הקבלה. נסה שוב מאוחר יותר.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchReceiptData();
    } else {
      setError('מספר הזמנה לא תקין');
      setLoading(false);
    }
  }, [orderId]);

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#fffef9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Arial, sans-serif',
        direction: 'rtl'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '20px' }}>⏳</div>
          <h2 style={{ color: '#4b2e1a' }}>טוען קבלה...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#fffef9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Arial, sans-serif',
        direction: 'rtl'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '10px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          textAlign: 'center',
          maxWidth: '500px'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '20px' }}>❌</div>
          <h2 style={{ color: '#d32f2f', marginBottom: '20px' }}>שגיאה</h2>
          <p style={{ color: '#666', marginBottom: '30px' }}>{error}</p>
          <button 
            onClick={() => navigate('/orders')}
            style={{
              padding: '12px 25px',
              backgroundColor: '#4b2e1a',
              color: 'white',
              border: 'none',
              borderRadius: '25px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600'
            }}
          >
            ← חזור להזמנות
          </button>
        </div>
      </div>
    );
  }

  if (!orderData || !orderItems.length) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#fffef9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Arial, sans-serif',
        direction: 'rtl'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '10px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          textAlign: 'center',
          maxWidth: '500px'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '20px' }}>📄</div>
          <h2 style={{ color: '#666', marginBottom: '20px' }}>לא נמצאו נתונים</h2>
          <p style={{ color: '#666', marginBottom: '30px' }}>לא נמצאו פרטי הזמנה או פריטים</p>
          <button 
            onClick={() => navigate('/orders')}
            style={{
              padding: '12px 25px',
              backgroundColor: '#4b2e1a',
              color: 'white',
              border: 'none',
              borderRadius: '25px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600'
            }}
          >
            ← חזור להזמנות
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {!loading && !error && orderData && (
        <Receipt 
          orderData={orderData} 
          orderItems={orderItems} 
          vatRate={vatRate} 
          onBack={() => window.history.back()}
        />
      )}
    </div>
  );
};

export default ReceiptPage;
