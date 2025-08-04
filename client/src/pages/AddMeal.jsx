import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import AdminNavbar from "../components/AdminNavbar";
import "./AddMeal.css";

const AddMeal = () => {
  const { isAdmin, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Check if user is admin, redirect if not
  useEffect(() => {
    if (!isAuthenticated() || !isAdmin()) {
      navigate("/");
    }
  }, [isAdmin, isAuthenticated, navigate]);
  const [formData, setFormData] = useState({
    meal_name: "",
    description: "",
    price: "",
    quantity: "",
    calories: "", // Added calories field
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);

      // Create preview URL for the selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageReset = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Check if user is admin before submitting
      if (!isAdmin()) {
        setMessage("אין לך הרשאות מנהל לביצוע פעולה זו");
        return;
      }

      // Create a FormData object to handle file uploads
      const mealFormData = new FormData();

      // Add all form fields to the FormData
      Object.keys(formData).forEach((key) => {
        if (formData[key]) {
          mealFormData.append(key, formData[key]);
        }
      });

      // Add the image file if one was selected
      if (selectedImage) {
        mealFormData.append("image", selectedImage);
      }

      // Get authentication token from session storage
      const token = sessionStorage.getItem("auth_token");

      if (!token) {
        setMessage("נדרשת התחברות מחדש");
        navigate("/login");
        return;
      }

      // Send the FormData to the server with authentication token
      const response = await fetch("http://localhost:3001/meals", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: mealFormData,
        // No need to set Content-Type header for FormData, browser will set it with boundary
      });

      let data;
      try {
        data = await response.json();
      } catch (e) {
        console.error("Error parsing response:", e);
        throw new Error(`שגיאה בפענוח תשובת השרת: ${e.message}`);
      }

      if (!response.ok) {
        console.error("Server error response:", data);

        if (response.status === 403) {
          throw new Error("אין לך הרשאות מנהל לביצוע פעולה זו");
        } else if (response.status === 401) {
          throw new Error("נדרשת התחברות מחדש");
        } else if (response.status === 400) {
          throw new Error(
            `שגיאת קלט: ${data.error || "נתונים חסרים או שגויים"}`
          );
        } else if (response.status === 409) {
          throw new Error(`מנה עם מזהה זה כבר קיימת במערכת`);
        } else {
          throw new Error(
            `שגיאה בהוספת מנה: ${data.error || `קוד שגיאה: ${response.status}`}`
          );
        }
      }

      console.log("Meal added successfully:", data);

      // Show success message
      setMessage("המנה נוספה בהצלחה!");

      // Clear form after submission
      setFormData({
        meal_name: "",
        description: "",
        price: "",
        quantity: "",
        calories: "",
      });

      // Clear image selection
      handleImageReset();

      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error adding meal:", error);
      setMessage("שגיאה בהוספת המנה. אנא נסה שוב.");
    }
  };

  return (
    <div className="add-meal-container">
      <AdminNavbar />
      <div className="admin-header">
        <h1>🍽️ הוספת מנה חדשה</h1>
      </div>

      <main>
        {message && <div className="success-message">{message}</div>}

        <form className="meal-form" onSubmit={handleSubmit}>
          {/* שדה מזהה מנה הוסר - יוגדר אוטומטית בשרת */}

          <label>
            שם המנה:
            <input
              type="text"
              name="meal_name"
              value={formData.meal_name}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            תיאור המנה:
            <textarea
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              required
            ></textarea>
          </label>

          <label>
            תמונת המנה:
            <div className="image-upload-container">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                ref={fileInputRef}
                className="file-input"
              />
              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="תצוגה מקדימה" />
                  <button
                    type="button"
                    onClick={handleImageReset}
                    className="remove-image-btn"
                  >
                    הסר תמונה
                  </button>
                </div>
              )}
            </div>
          </label>

          <label>
            קלוריות:
            <input
              type="number"
              name="calories"
              value={formData.calories}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            מחיר:
            <input
              type="number"
              name="price"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            כמות זמינה:
            <input
              type="number"
              name="quantity"
              min="1"
              value={formData.quantity}
              onChange={handleChange}
              required
            />
          </label>

          <button type="submit">➕ הוסף מנה</button>
        </form>
      </main>
    </div>
  );
};

export default AddMeal;
