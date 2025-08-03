import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./ContactUs.css";




const ContactUs = () => {
  const [formData, setFormData] = useState({
   full_name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isLoading, setIsLoading] = useState(false);

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

    try {
      const response = await fetch("http://localhost:3001/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("ההודעה נשלחה בהצלחה!");
        setFormData({ full_name: "", email: "", subject: "", message: "" });
      } else {
        alert("אירעה שגיאה בשליחה, נסה שוב מאוחר יותר.");
      }
    } catch (error) {
      console.error("שגיאה בשליחה:", error);
      alert("שגיאה בחיבור לשרת.");
    }

    setIsLoading(false);
  };
  

  return (
    <div className="contact-container">
      <h2>צור קשר</h2>
      <p>נשמח לשמוע ממך! מלא את הפרטים ונחזור אליך בהקדם</p>
      <form className="contact-form" onSubmit={handleSubmit}>
        <label>
          שם מלא
          <input
            type="text"
            name="full_name"
            value={formData.name}
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
