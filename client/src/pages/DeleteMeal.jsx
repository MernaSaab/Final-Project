import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./DeleteMeal.css";

const DeleteMeal = () => {
  const { isAdmin, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirmMessage, setConfirmMessage] = useState("");
  const [mealToDelete, setMealToDelete] = useState(null);
  const [success, setSuccess] = useState("");

  // Check if user is admin, redirect if not
  useEffect(() => {
    if (!isAuthenticated() || !isAdmin()) {
      navigate("/");
    }
  }, [isAdmin, isAuthenticated, navigate]);

  // Fetch meals from API
  useEffect(() => {
    const fetchMeals = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:3001/meals");

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setMeals(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching meals:", error);
        setError("שגיאה בטעינת המנות. אנא נסה שוב מאוחר יותר.");
        setLoading(false);
      }
    };

    fetchMeals();
  }, []);

  // Handle delete click
  const handleDeleteClick = (meal) => {
    setMealToDelete(meal);
    setConfirmMessage(`האם אתה בטוח שברצונך למחוק את "${meal.meal_name}"?`);
  };

  // Handle delete confirmation
  const confirmDelete = async () => {
    if (mealToDelete) {
      try {
        // Check if user is admin before submitting
        if (!isAdmin()) {
          setConfirmMessage("אין לך הרשאות מנהל לביצוע פעולה זו");
          return;
        }

        // Get authentication token from session storage
        const token = sessionStorage.getItem("auth_token");

        if (!token) {
          setError("נדרשת התחברות מחדש");
          navigate("/login");
          return;
        }

        // Delete the meal from the server with authentication token
        const response = await fetch(
          `http://localhost:3001/meals/${mealToDelete.meal_id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        let data;
        try {
          data = await response.json();
        } catch (e) {
          console.error("Error parsing response:", e);
          // If we can't parse JSON, it might be that the server returned empty response on success
          if (response.ok) {
            // Update the meals list on success
            setMeals(
              meals.filter((meal) => meal.meal_id !== mealToDelete.meal_id)
            );
            setSuccess(`המנה ${mealToDelete.meal_name} נמחקה בהצלחה`);
            setMealToDelete(null);
            return;
          }
          throw new Error(`שגיאה בפענוח תשובת השרת: ${e.message}`);
        }

        if (!response.ok) {
          console.error("Server error response:", data);

          if (response.status === 403) {
            throw new Error("אין לך הרשאות מנהל לביצוע פעולה זו");
          } else if (response.status === 401) {
            throw new Error("נדרשת התחברות מחדש");
          } else if (response.status === 404) {
            throw new Error(`המנה לא נמצאה במערכת`);
          } else {
            throw new Error(
              `שגיאה במחיקת המנה: ${
                data.error || `קוד שגיאה: ${response.status}`
              }`
            );
          }
        }

        // Update the meals list
        setMeals(meals.filter((meal) => meal.meal_id !== mealToDelete.meal_id));
        setSuccess(`המנה ${mealToDelete.meal_name} נמחקה בהצלחה`);

        // Clear the confirmation message
        setConfirmMessage("");
        setMealToDelete(null);
      } catch (error) {
        console.error("Error deleting meal:", error);
        setConfirmMessage("שגיאה במחיקת המנה. אנא נסה שוב.");
      }
    }
  };

  // Cancel delete
  const cancelDelete = () => {
    setConfirmMessage("");
    setMealToDelete(null);
  };

  return (
    <div className="delete-meal-container">
      <header>
        <h1>🗑️ מחיקת מנות</h1>
        <nav>
          <Link to="/admin">דף ניהול</Link>
          <Link to="/orders">הזמנות</Link>
          <Link to="/admin/users">ניהול משתמשים</Link>
          <Link to="/admin/add-meal">הוספת מנה</Link>
        </nav>
      </header>

      <main>
        {loading ? (
          <div className="loading">טוען מנות...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <>
            {confirmMessage && (
              <div className="confirm-dialog">
                <p>{confirmMessage}</p>
                <div className="confirm-actions">
                  <button onClick={confirmDelete} className="confirm-btn">
                    כן, מחק
                  </button>
                  <button onClick={cancelDelete} className="cancel-btn">
                    ביטול
                  </button>
                </div>
              </div>
            )}

            {meals.length === 0 ? (
              <div className="no-meals">לא נמצאו מנות</div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>תמונה</th>
                    <th>שם המנה</th>
                    <th>תיאור</th>
                    <th>מחיר</th>
                    <th>כמות</th>
                    <th>פעולה</th>
                  </tr>
                </thead>
                <tbody>
                  {meals.map((meal) => (
                    <tr key={meal.meal_id}>
                      <td>
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
                      <td>{meal.description}</td>
                      <td>₪{meal.price}</td>
                      <td>{meal.quantity}</td>
                      <td className="action-buttons">
                        <Link
                          to={`/admin/edit-meal/${meal.meal_id}`}
                          className="edit-btn"
                        >
                          ערוך
                        </Link>
                        <button
                          className="delete-btn"
                          onClick={() => handleDeleteClick(meal)}
                        >
                          מחק
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}
      </main>

      <footer>
        <p>כל הזכויות שמורות</p>
      </footer>
    </div>
  );
};

export default DeleteMeal;
