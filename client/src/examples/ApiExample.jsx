import React, { useState } from 'react';
import useApi from '../hooks/useApi';
import { mealApi, categoryApi } from '../services/api';

/**
 * Example component showing how to use the API service with the useApi hook
 * This demonstrates fetching data from multiple endpoints and handling loading/error states
 */
const ApiExample = () => {
  // Using the useApi hook to fetch meals
  const { 
    data: meals, 
    loading: mealsLoading, 
    error: mealsError 
  } = useApi(mealApi.getAllMeals, [], true);

  // Using the useApi hook to fetch categories
  const { 
    data: categories, 
    loading: categoriesLoading, 
    error: categoriesError 
  } = useApi(categoryApi.getAllCategories, [], true);

  // State for a new meal form
  const [newMeal, setNewMeal] = useState({
    meal_name: '',
    description: '',
    price: 0
  });

  // Using the useApi hook for creating a meal (not loading on mount)
  const { 
    execute: createMeal, 
    loading: createLoading, 
    error: createError 
  } = useApi(mealApi.createMeal, [], false);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMeal({
      ...newMeal,
      [name]: name === 'price' ? parseFloat(value) : value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await createMeal(newMeal);
    if (result) {
      // Reset form on success
      setNewMeal({
        meal_name: '',
        description: '',
        price: 0
      });
      // You could refresh the meals list here if needed
    }
  };

  return (
    <div className="api-example" dir="rtl">
      <h1>דוגמה לשימוש ב-API</h1>
      
      {/* Display meals */}
      <section>
        <h2>מנות</h2>
        {mealsLoading ? (
          <p>טוען מנות...</p>
        ) : mealsError ? (
          <p className="error">שגיאה: {mealsError}</p>
        ) : meals && meals.length > 0 ? (
          <ul>
            {meals.map((meal) => (
              <li key={meal.meal_id}>
                <strong>{meal.meal_name}</strong> - ₪{meal.price}
                <p>{meal.description}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>לא נמצאו מנות</p>
        )}
      </section>

      {/* Display categories */}
      <section>
        <h2>קטגוריות</h2>
        {categoriesLoading ? (
          <p>טוען קטגוריות...</p>
        ) : categoriesError ? (
          <p className="error">שגיאה: {categoriesError}</p>
        ) : categories && categories.length > 0 ? (
          <ul>
            {categories.map((category) => (
              <li key={category.category_id}>{category.category_name}</li>
            ))}
          </ul>
        ) : (
          <p>לא נמצאו קטגוריות</p>
        )}
      </section>

      {/* Form for adding a new meal */}
      <section>
        <h2>הוספת מנה חדשה</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="meal_name">שם המנה:</label>
            <input
              type="text"
              id="meal_name"
              name="meal_name"
              value={newMeal.meal_name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label htmlFor="description">תיאור:</label>
            <textarea
              id="description"
              name="description"
              value={newMeal.description}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label htmlFor="price">מחיר:</label>
            <input
              type="number"
              id="price"
              name="price"
              value={newMeal.price}
              onChange={handleInputChange}
              step="0.01"
              min="0"
              required
            />
          </div>
          <button type="submit" disabled={createLoading}>
            {createLoading ? 'שולח...' : 'הוסף מנה'}
          </button>
          {createError && <p className="error">שגיאה: {createError}</p>}
        </form>
      </section>
    </div>
  );
};

export default ApiExample;
