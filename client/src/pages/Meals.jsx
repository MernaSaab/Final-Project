import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Meals.css";
import { mealApi, categoryApi } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import LoadingSpinner from "../components/LoadingSpinner";
import MealCard from "../components/MealCard";

const Meals = () => {
  const [meals, setMeals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartMessage, setCartMessage] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [showCart, setShowCart] = useState(false);

  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const {
    cart,
    addItem,
    updateQty,
    removeItem,
    clearCart,
    totalItems,
    totalPrice,
  } = useCart();
  const navigate = useNavigate();

  // Fetch meals and categories from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch meals from the backend
        const mealsData = await mealApi.getAllMeals();
        setMeals(Array.isArray(mealsData) ? mealsData : []);

        // Fetch categories from the backend
        const categoriesData = await categoryApi.getAllCategories();
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("שגיאה בטעינת הנתונים. אנא נסה שוב מאוחר יותר.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // We don't need to load or save cart here anymore as CartContext handles that

  // Function to handle adding items to cart using CartContext
  const addToCart = (meal) => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      navigate("/login", { state: { from: "/meals" } });
      return;
    }

    // Create a cart item from the meal
    const cartItem = {
      id: meal.meal_id,
      name: meal.meal_name,
      price: Number(meal.price), // Ensure price is a number
      imgUrl: meal.image_url,
      description: meal.description,
      calories: meal.calories,
    };

    // Add to cart using CartContext
    addItem(cartItem, 1);

    // Show success message
    setCartMessage(`${meal.meal_name} נוסף לסל הקניות`);
    setTimeout(() => {
      setCartMessage("");
    }, 3000);
  };

  const removeFromCart = (mealId) => {
    removeItem(mealId);
  };

  const updateQuantity = (mealId, newQuantity) => {
    if (newQuantity < 1) {
      removeItem(mealId);
      return;
    }

    updateQty(mealId, newQuantity);
  };

  const getTotalPrice = () => {
    return totalPrice;
  };

  const checkout = async () => {
    if (cart.length === 0) return;

    try {
      // Create orders for each item in cart
      for (const item of cart) {
        await mealApi.createOrder({
          meal_id: item.id, // Using correct property name
          quantity: item.qty, // Using correct property name
          status: "pending",
        });
      }

      // Clear cart and show success message
      clearCart(); // Using the clearCart function from CartContext
      setCartMessage("ההזמנה בוצעה בהצלחה!");
      setTimeout(() => {
        setCartMessage("");
      }, 3000);
    } catch (error) {
      setError("שגיאה בביצוע ההזמנה. אנא נסה שוב.");
      console.error("Checkout error:", error);
    }
  };

  // Filter meals by active category
  const filteredMeals =
    activeCategory === "all"
      ? Array.isArray(meals)
        ? meals
        : []
      : Array.isArray(meals)
      ? meals.filter((meal) => meal.category_id === parseInt(activeCategory))
      : [];

  return (
    <div className="meals-page">
      <header>
        <h1>🍴 הזמנת מנות בריאות</h1>
        <nav>
          <Link to="/">דף הבית</Link>
          <Link to="/meals">תפריט</Link>
          <Link to="/cart">סל קניות</Link>
          <Link to="/contact">צור קשר</Link>
          {isAdmin() && (
            <Link to="/admin" className="admin-link">
              ניהול
            </Link>
          )}
          {!isAuthenticated() && (
            <>
              <Link to="/login">התחברות</Link>
              <Link to="/signup">הרשמה</Link>
            </>
          )}
          {isAuthenticated() && (
            <Link
              to="#"
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="logout-link"
            >
              התנתק
            </Link>
          )}
        </nav>
      </header>

      {cartMessage && <div className="cart-message">{cartMessage}</div>}

     

      {loading ? (
        <div className="loading-container">
          <LoadingSpinner />
          <p>טוען מנות...</p>
        </div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <main className="meals-container">
          {/* Category filter */}
          <div className="category-filter">
            <button
              className={activeCategory === "all" ? "active" : ""}
              onClick={() => setActiveCategory("all")}
            >
              הכל
            </button>
            {Array.isArray(categories) &&
              categories.map((category) => (
                <button
                  key={category.category_id}
                  className={
                    activeCategory === category.category_id.toString()
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setActiveCategory(category.category_id.toString())
                  }
                >
                  {category.category_name}
                </button>
              ))}
          </div>

          {/* Display meals using MealCard component */}
          <section className="meals-grid">
            {filteredMeals.length === 0 ? (
              <p className="no-meals">לא נמצאו מנות בקטגוריה זו</p>
            ) : (
              <div className="card-grid">
             {filteredMeals.map((meal) => (
             <MealCard
               key={meal.meal_id}
                meal={{ ...meal, price: Number(meal.price) }}
                    onAddToCart={addToCart}
  />
))}
              </div>
            )}
          </section>
        </main>
      )}
    </div>
  );
};

export default Meals;
