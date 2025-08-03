import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import AdminNavbar from "../components/AdminNavbar";
import "./AdminMealsList.css";

const LoadingSpinner = ({ message }) => (
  <div className="loading-container">
    <div className="spinner"></div>
    <p>{message || "טוען..."}</p>
  </div>
);

const EditMealModal = ({ meal, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    meal_name: meal.meal_name || "",
    description: meal.description || "",
    price: meal.price || "",
    quantity: meal.quantity || "",
    calories: meal.calories || "",
    image_url: meal.image_url || "",
    old_image_url: meal.image_url || "",
  });
  const [imagePreview, setImagePreview] = useState(meal.image_url || "");
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const token = sessionStorage.getItem("auth_token");
      if (!token) {
        throw new Error("אין הרשאת גישה");
      }

      const data = new FormData();
      data.append("meal_name", formData.meal_name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("quantity", formData.quantity);
      data.append("calories", formData.calories);

      if (imageFile) {
        data.append("image", imageFile);
        data.append("old_image_url", formData.old_image_url);
      } else {
        data.append("image_url", formData.image_url);
      }

      await onSave(meal.meal_id, data);
      onClose();
    } catch (error) {
      setError(error.message || "שגיאה בעדכון המנה");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>עריכת מנה</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="meal_name">שם המנה:</label>
            <input
              type="text"
              id="meal_name"
              name="meal_name"
              value={formData.meal_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">תיאור:</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
            ></textarea>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">מחיר:</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
              />
            </div>

            <div className="form-group">
              <label htmlFor="quantity">כמות במלאי:</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="calories">קלוריות:</label>
              <input
                type="number"
                id="calories"
                name="calories"
                value={formData.calories}
                onChange={handleChange}
                min="0"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="image">תמונה:</label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleImageChange}
              accept="image/*"
            />
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="תצוגה מקדימה" />
              </div>
            )}
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="save-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "שומר..." : "שמור שינויים"}
            </button>
            <button
              type="button"
              className="cancel-button"
              onClick={onClose}
              disabled={isSubmitting}
            >
              ביטול
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AdminMealsList = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingMeal, setEditingMeal] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin()) {
      logout();
      navigate("/login");
      return;
    }

    fetchMeals();
  }, [isAdmin, logout, navigate]);

  const fetchMeals = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("auth_token");
      if (!token) {
        throw new Error("אין הרשאת גישה");
      }

      // Using absolute URL like in Admin.jsx
      const response = await fetch("http://localhost:3001/meals", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("שגיאה בטעינת המנות");
      }

      const data = await response.json();
      console.log("Fetched meals:", data); // Debug log
      setMeals(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching meals:", error);
      setError(error.message || "שגיאה בטעינת המנות");
    } finally {
      setLoading(false);
    }
  };

  const handleEditMeal = (meal) => {
    setEditingMeal(meal);
  };

  const handleDeleteConfirm = (mealId) => {
    setConfirmDelete(mealId);
  };

  const handleDeleteCancel = () => {
    setConfirmDelete(null);
  };

  const handleDeleteMeal = async (mealId) => {
    try {
      const token = sessionStorage.getItem("auth_token");
      if (!token) {
        throw new Error("אין הרשאת גישה");
      }

      // Delete the meal directly
      // The backend will handle any related records in the database
      const response = await fetch(`http://localhost:3001/meals/${mealId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server response:", errorText);
        throw new Error("שגיאה במחיקת המנה");
      }

      // Update the meals list
      setMeals(meals.filter((meal) => meal.meal_id !== mealId));
      setConfirmDelete(null);
    } catch (error) {
      console.error("Error deleting meal:", error);
      setError(error.message || "שגיאה במחיקת המנה");
    }
  };

  const handleSaveMeal = async (mealId, formData) => {
    try {
      const token = sessionStorage.getItem("auth_token");
      if (!token) {
        throw new Error("אין הרשאת גישה");
      }

      const response = await fetch(`http://localhost:3001/meals/${mealId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          // Note: Don't set Content-Type when sending FormData
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("שגיאה בעדכון המנה");
      }

      const result = await response.json();

      // Update the meals list with the updated meal
      setMeals(
        meals.map((meal) => {
          if (meal.meal_id === mealId) {
            // Create a new meal object with updated values from the form
            const updatedMeal = { ...meal };

            // Update with form values
            for (const [key, value] of formData.entries()) {
              if (key !== "image" && key !== "old_image_url") {
                updatedMeal[key] = value;
              }
            }

            // If the image was updated, use the new URL from the response
            if (result.image_url) {
              updatedMeal.image_url = result.image_url;
            }

            return updatedMeal;
          }
          return meal;
        })
      );

      setEditingMeal(null);
    } catch (error) {
      console.error("Error updating meal:", error);
      throw error;
    }
  };

  const handleCloseModal = () => {
    setEditingMeal(null);
  };

  const filteredMeals = meals.filter((meal) => {
    if (!searchTerm) return true;

    const term = searchTerm.toLowerCase();
    return (
      meal.meal_name.toLowerCase().includes(term) ||
      (meal.description && meal.description.toLowerCase().includes(term))
    );
  });

  if (loading) {
    return (
      <div className="admin-meals-list-container">
        <AdminNavbar />
        <LoadingSpinner message="טוען רשימת מנות..." />
      </div>
    );
  }

  return (
    <div className="admin-meals-list-container">
      <AdminNavbar />

      <main>
        <h2>רשימת מנות</h2>

        {error && <div className="error-message">{error}</div>}

        <div className="search-container">
          <input
            type="text"
            placeholder="חיפוש מנות..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="meals-table-container">
          <table className="meals-table">
            <thead>
              <tr>
                <th>תמונה</th>
                <th>שם המנה</th>
                <th>תיאור</th>
                <th>מחיר</th>
                <th>כמות במלאי</th>
                <th>קלוריות</th>
                <th>פעולות</th>
              </tr>
            </thead>
            <tbody>
              {filteredMeals.length === 0 ? (
                <tr>
                  <td colSpan="7" className="no-meals">
                    לא נמצאו מנות
                  </td>
                </tr>
              ) : (
                filteredMeals.map((meal) => (
                  <tr key={meal.meal_id}>
                    <td className="meal-image-cell">
                      {meal.image_url ? (
                        <img
                          src={meal.image_url}
                          alt={meal.meal_name}
                          className="meal-thumbnail"
                        />
                      ) : (
                        <div className="no-image">אין תמונה</div>
                      )}
                    </td>
                    <td>{meal.meal_name}</td>
                    <td className="description-cell">
                      {meal.description || "-"}
                    </td>
                    <td>₪{meal.price}</td>
                    <td>{meal.quantity || "-"}</td>
                    <td>{meal.calories || "-"}</td>
                    <td className="actions-cell">
                      <button
                        className="edit-button"
                        onClick={() => handleEditMeal(meal)}
                      >
                        עריכה
                      </button>

                      {confirmDelete === meal.meal_id ? (
                        <div className="delete-confirm">
                          <span>למחוק?</span>
                          <button
                            className="confirm-yes"
                            onClick={() => handleDeleteMeal(meal.meal_id)}
                          >
                            כן
                          </button>
                          <button
                            className="confirm-no"
                            onClick={handleDeleteCancel}
                          >
                            לא
                          </button>
                        </div>
                      ) : (
                        <button
                          className="delete-button"
                          onClick={() => handleDeleteConfirm(meal.meal_id)}
                        >
                          מחיקה
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      <footer className="admin-footer">
        <p> מערכת ניהול מנות</p>
      </footer>

      {editingMeal && (
        <EditMealModal
          meal={editingMeal}
          onClose={handleCloseModal}
          onSave={handleSaveMeal}
        />
      )}
    </div>
  );
};

export default AdminMealsList;
