import React, { useState } from "react";
import "./UpdateUser.css";

function UpdateUser({ user, onUpdate }) {
  const [formData, setFormData] = useState({
    full_name: user.full_name,
    email: user.email,
    phone: user.phone,
    gender: user.gender,
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
  };

  return (
    <div className="update-user-container">
      <h2>עדכון משתמש</h2>
      <form className="update-user-form" onSubmit={handleSubmit}>
        <label>שם מלא</label>
        <input
          type="text"
          name="full_name"
          value={formData.full_name}
          onChange={handleChange}
        />
        <label>אימייל</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        <label>טלפון</label>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />
        <label>מגדר</label>
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
        >
          <option value="">בחר מגדר</option>
          <option value="נקבה">נקבה</option>
          <option value="זכר">זכר</option>
        </select>
        <button type="submit" className="update-btn">
          עדכון
        </button>
      </form>
    </div>
  );
}

export default UpdateUser;