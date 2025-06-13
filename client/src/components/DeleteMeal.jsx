import React, { useState } from "react";
import { Link } from "react-router-dom";

import "../styles/DeleteMeals.css";

export default function DeleteMeal() {
  const [meals, setMeals] = useState([
    {
      name: "סלט קינואה",
      description: "סלט טרי עם ירקות וגרגירי קינואה",
      price: "28 ₪",
      quantity: 15,
    },
    {
      name: "מרק עדשים",
      description: "מרק חם ובריא על בסיס עדשים כתומות",
      price: "22 ₪",
      quantity: 10,
    },
  ]);

  const handleDelete = (index) => {
    const mealName = meals[index].name;
    if (window.confirm(`האם אתה בטוח שברצונך למחוק את "${mealName}"?`)) {
      const updated = [...meals];
      updated.splice(index, 1);
      setMeals(updated);
    }
  };

  return (
    <div>
      <header>
        <h1>🗑️ מחיקת מנות</h1>
        <nav>
          <Link to="/admin">דף מנהל</Link>
          <Link to="/orders">הזמנות</Link>
          <Link to="/adminusers">ניהול משתמשים</Link>
          <Link to="/addmeal">הוסף מנות</Link>
        </nav>
      </header>

      <main>
        <table>
          <thead>
            <tr>
              <th>שם המנה</th>
              <th>תיאור</th>
              <th>מחיר</th>
              <th>כמות</th>
              <th>פעולה</th>
            </tr>
          </thead>
          <tbody>
            {meals.map((meal, index) => (
              <tr key={index}>
                <td>{meal.name}</td>
                <td>{meal.description}</td>
                <td>{meal.price}</td>
                <td>{meal.quantity}</td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(index)}
                  >
                    🗑️ מחק
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>

      <footer>
        <p>כל הזכויות שמורות</p>
      </footer>
    </div>
  );
}
