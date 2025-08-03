import React, { useRef } from 'react';
import './Receipt.css';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const Receipt = ({ orderData, orderItems, vatRate = 17, onBack }) => {
  const receiptRef = useRef(null);
  
  const downloadPDF = async () => {
    if (!receiptRef.current) return;
    
    try {
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        useCORS: true,
        logging: false
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 210; // A4 width in mm
      const imgHeight = canvas.height * imgWidth / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`receipt-${orderData.order_id}.pdf`);
    } catch (err) {
      console.error('Error generating PDF:', err);
      alert('שגיאה ביצירת ה-PDF. אנא נסה שוב מאוחר יותר.');
    }
  };
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('he-IL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateTotals = () => {
    const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const vatAmount = subtotal * (vatRate / 100);
    const total = subtotal + vatAmount;
    
    return {
      subtotal: subtotal.toFixed(2),
      vatAmount: vatAmount.toFixed(2),
      total: total.toFixed(2)
    };
  };

  const { subtotal, vatAmount, total } = calculateTotals();

  return (
    <div className="receipt-container" ref={receiptRef}>
      <div className="receipt-header">
        <h1>🥗 אורח חיים בריא - מלנה</h1>
        <h2>קבלה</h2>
        <div className="receipt-number">
          <strong>מספר קבלה: #{orderData?.order_id || ''}</strong>
        </div>
      </div>

      <div className="receipt-info">
        <div className="business-info">
          <h3>פרטי העסק:</h3>
          <p><strong>אורח חיים בריא - מלנה</strong></p>
          <p>מספר עוסק מורשה: 123456789</p>
          <p>כתובת: רחוב הבריאות 123, תל אביב</p>
          <p>טלפון: 03-1234567</p>
          <p>אימייל: info@healthy-melana.co.il</p>
        </div>

        <div className="customer-info">
          <h3>פרטי הלקוח:</h3>
          <p><strong>{orderData?.first_name || ''} {orderData?.last_name || ''}</strong></p>
          <p>טלפון: {orderData?.phone || ''}</p>
          <p>אימייל: {orderData?.email || ''}</p>
          <p>כתובת: {orderData?.address || ''}</p>
          <p>ת.ז: {orderData?.id_number || ''}</p>
        </div>
      </div>

      <div className="receipt-date">
        <p><strong>תאריך הזמנה:</strong> {formatDate(orderData?.order_date)}</p>
        <p><strong>סטטוס:</strong> {orderData?.status || ''}</p>
      </div>

      <div className="receipt-items">
        <h3>פריטים שהוזמנו:</h3>
        <table className="items-table">
          <thead>
            <tr>
              <th>פריט</th>
              <th>מחיר יחידה</th>
              <th>כמות</th>
              <th>סה"כ</th>
            </tr>
          </thead>
          <tbody>
            {orderItems.map((item, index) => (
              <tr key={index}>
                <td>{item.meal_name}</td>
                <td>₪{item.price}</td>
                <td>{item.quantity}</td>
                <td>₪{(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="receipt-totals">
        <div className="totals-row">
          <span>סכום ביניים:</span>
          <span>₪{subtotal}</span>
        </div>
        <div className="totals-row">
          <span>מע"מ ({vatRate}%):</span>
          <span>₪{vatAmount}</span>
        </div>
        <div className="totals-row total-final">
          <span><strong>סה"כ לתשלום:</strong></span>
          <span><strong>₪{total}</strong></span>
        </div>
      </div>

      <div className="receipt-footer">
        <p>תודה על הזמנתך! 🌟</p>
        <p>אנו מקווים שתיהנה מהמנות הבריאות שלנו</p>
        <p className="receipt-note">
          * קבלה זו נשלחה גם לכתובת המייל שלך
        </p>
      </div>

      <div className="receipt-actions">
        <button onClick={downloadPDF} className="download-btn">
          📥 הורד כ-PDF
        </button>
        <button onClick={() => window.print()} className="print-btn">
          🖨️ הדפס קבלה
        </button>
        <button onClick={onBack} className="back-btn">
          ← חזור
        </button>
      </div>
    </div>
  );
};

export default Receipt;
