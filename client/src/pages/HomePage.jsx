import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import SideMenu from '../components/SideMenu';
import './HomePage.css';

const HomePage = () => {
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    age: '',
    gender: 'male',
    weight: '',
    height: '',
    activityLevel: 'sedentary'
  });
  
  const [calorieResult, setCalorieResult] = useState('');
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const calculateCalories = (e) => {
    e.preventDefault();
    
    const { age, gender, weight, height, activityLevel } = formData;
    
    // BMR calculation using Mifflin-St Jeor Equation
    let bmr;
    if (gender === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }
    
    // Activity multipliers
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9
    };
    
    const calories = Math.round(bmr * activityMultipliers[activityLevel]);
    
    setCalorieResult(`הקלוריות היומיות המומלצות עבורך: ${calories} קלוריות`);
  };
  
  // Sample meal data
  const featuredMeals = [
    { id: 1, name: 'סלט ירקות עם גבינה', image: '/images/salad1.png' },
    { id: 2, name: ' סלט חזה עוף' , image: '/images/meal2.png' },
    { id: 3, name: 'מנת ציקן עם אורז', image: '/images/meal3.png' }
  ];
  
  // Health tips
 const healthTips = [
  'תשתה לפחות 8 כוסות מים ביום',
  'תשמור על 7-8 שעות שינה כל לילה',
  'תשלב ירקות ופירות בכל ארוחה',
  'תימנע משתייה ממותקת',
  'תבחר מזון טבעי ולא מעובד',
  'תצא להליכה של לפחות 30 דקות ביום',
  'תתרגל נשימות עמוקות להורדת לחץ',
  'תשב לאכול בנחת, בלי טלפון',
  'תשמור על שגרה ולא על דיאטה זמנית',
  'תאהב את עצמך גם בדרך, לא רק בתוצאה'
];

  return (
    
    <div>
        <SideMenu />
      {/* Navigation Bar */}
      <header className="main-header">
        <div className="logo-container">
          <div className="logo-text">
            ארוחות בריאות
            <span>Healthy Lifestyle By Melana </span>
          </div>
        </div>
        <nav className="nav">
          <Link to="/">דף הבית</Link>
          <Link to="/meals">תפריט</Link>
          <Link to="/cart">סל קניות</Link>
          <Link to="/contact">צור קשר</Link>
          {isAdmin() && (
            <Link to="/admin" className="admin-link">ניהול</Link>
          )}
          {!isAuthenticated() && (
            <>
              <Link to="/login">התחברות</Link>
              <Link to="/signup">הרשמה</Link>
            </>
          )}
          {isAuthenticated() && (
            <Link to="#" onClick={() => {
              logout();
              navigate('/');
            }} className="logout-link">התנתק</Link>
          )}
        </nav>
      </header>
      {/* Hero Section */}
      <section className="hero">
        <div className="logo-text">
          ארוחות בריאות
          <span>Healthy Lifestyle By Melana </span>
        </div>
        <h1 className="main-title">ברוכים הבאים לאתר הארוחות הבריאות</h1>
        <p className="subtitle">ארוחות טעימות ובריאות במשלוח עד הבית</p>
        <Link to="/meals" className="cta-btn">הזמינו עכשיו</Link>
      </section>

      {/* Daily Tip */}
      <div className="daily-tip">
        💡 טיפ היום: אכילת ארוחת בוקר מאוזנת מסייעת בשמירה על רמות אנרגיה לאורך היום.
      </div>

      {/* Featured Meals */}
      <section className="meal-gallery">
        <h2>הארוחות הפופולריות שלנו</h2>
        
        
        <div className="gallery-grid">
          {featuredMeals.map(meal => (
            <div key={meal.id} className="meal-card">
              <img 
                src={process.env.PUBLIC_URL + meal.image} 
                alt={meal.name} 
                style={{ maxWidth: '100%', height: 'auto' }}
                onError={(e) => {
                  console.error(`Error loading image: ${meal.image}`);
                  e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                }}
              />
              <p>{meal.name}</p>
            </div>
          ))}
        </div>
        <div className="meals-cta">
          <Link to="/meals" className="meals-btn">לכל הארוחות</Link>
        </div>
      </section>

      {/* Calorie Calculator */}
      <section className="calorie-calculator">
        <h2>מחשבון קלוריות</h2>
        <form id="calorieForm" onSubmit={calculateCalories}>
          <label>
            גיל:
            <input 
              type="number" 
              name="age" 
              value={formData.age} 
              onChange={handleInputChange}
              required 
            />
          </label>
          
          <label>
            מין:
            <select 
              name="gender" 
              value={formData.gender} 
              onChange={handleInputChange}
            >
              <option value="male">זכר</option>
              <option value="female">נקבה</option>
            </select>
          </label>
          
          <label>
            משקל (ק"ג):
            <input 
              type="number" 
              name="weight" 
              value={formData.weight} 
              onChange={handleInputChange}
              required 
            />
          </label>
          
          <label>
            גובה (ס"מ):
            <input 
              type="number" 
              name="height" 
              value={formData.height} 
              onChange={handleInputChange}
              required 
            />
          </label>
          
          <label>
            רמת פעילות:
            <select 
              name="activityLevel" 
              value={formData.activityLevel} 
              onChange={handleInputChange}
            >
              <option value="sedentary">מינימלית (עבודה משרדית)</option>
              <option value="light">קלה (1-3 אימונים בשבוע)</option>
              <option value="moderate">בינונית (3-5 אימונים בשבוע)</option>
              <option value="active">גבוהה (6-7 אימונים בשבוע)</option>
              <option value="veryActive">גבוהה מאוד (אימונים מרובים)</option>
            </select>
          </label>
          
          <button type="submit">חשב קלוריות</button>
        </form>
        
        {calorieResult && <div id="result">{calorieResult}</div>}
      </section>

      {/* Health Tips */}
      <section className="tips-section">
        <h2>טיפים לאורח חיים בריא</h2>
        <div className="tips-grid">
          {healthTips.map((tip, index) => (
            <div key={index} className="tip-card">
              {tip}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
