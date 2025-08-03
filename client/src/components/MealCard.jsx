import React from 'react';
import PropTypes from 'prop-types';
import './MealCard.css';

const MealCard = ({ meal, onAddToCart }) => {
  return (
    <div className="meal-card">
      <img 
        src={meal.image_url || `${process.env.PUBLIC_URL}/images/default-meal.png`} 
        alt={meal.meal_name} 
      />
      <h3>{meal.meal_name}</h3>
      <p>{meal.description}</p>
      <p><strong>קלוריות:</strong> {meal.calories || 'לא צוין'}</p>
      <p><strong>₪{meal.price}</strong></p>
      <button 
        className="add-to-cart" 
        onClick={() => onAddToCart(meal)}
      >
        🛒 הוסף לסל
      </button>
    </div>
  );
};


MealCard.propTypes = {
  meal: PropTypes.shape({
    meal_id: PropTypes.number.isRequired,
    meal_name: PropTypes.string.isRequired,
    description: PropTypes.string,
    calories: PropTypes.number,
    price: PropTypes.number.isRequired,
    image_url: PropTypes.string
  }).isRequired,
  onAddToCart: PropTypes.func.isRequired
};

export default MealCard;
