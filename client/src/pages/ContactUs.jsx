import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./ContactUs.css";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    number: "",
    subject: "",
    message: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSubmitStatus(null);
  
    try {
      const response = await fetch("http://localhost:3001/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
  
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Server error");
      }
  
      // הצלחה
      setFormData({ full_name: "", email: "", number: "", subject: "", message: "" });
      setSubmitStatus({ success: true, message: "ההודעה נשלחה בהצלחה" });
    } catch (err) {
      console.error("Contact submit error:", err);
      setSubmitStatus({ success: false, message: "אירעה שגיאה בשליחה, נסי שוב מאוחר יותר" });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="contact-container">
      <h2>צור קשר</h2>
      <p>נשמח לשמוע ממך! מלא את הפרטים ונחזור אליך בהקדם</p>
      
      {submitStatus && (
        <div className={`status-message ${submitStatus.success ? 'success' : 'error'}`}>
          {submitStatus.message}
        </div>
      )}
      
      <form className="contact-form" onSubmit={handleSubmit}>
        <label>
          שם מלא
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            autoComplete="off"
            required
          />
        </label>

        <label>
          אימייל
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            autoComplete="off"
            required
          />
        </label>

        <label>
          מספר טלפון
          <input
            type="tel"
            name="number"
            value={formData.number}
            onChange={handleChange}
            autoComplete="off"
          />
        </label>

        <label>
          נושא
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            autoComplete="off"
            required
          />
        </label>

        <label>
          הודעה
          <textarea
            rows="5"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
        </label>

        <button type="submit" disabled={isLoading}>
          {isLoading ? "שולח..." : "שלח הודעה"}
        </button>
      </form>

      <div className="back-home">
        <Link to="/" className="home-btn">
          ⬅️ חזרה לדף הבית
        </Link>
      </div>
    </div>
  );
};

export default ContactUs;
