import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import './EditMeal.css';

const EditMeal = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    meal_id: '',
    meal_name: '',
    description: '',
    price: '',
    quantity: '',
    calories: ''
  });
  
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const fileInputRef = useRef(null);

  // Fetch meal data
  useEffect(() => {
    const fetchMeal = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3001/meals/${id}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const meal = await response.json();
        
        setFormData({
          meal_id: meal.meal_id || '',
          meal_name: meal.meal_name || '',
          description: meal.description || '',
          price: meal.price || '',
          quantity: meal.quantity || '',
          calories: meal.calories || ''
        });
        
        if (meal.image_url) {
          setCurrentImageUrl(meal.image_url);
          setImagePreview(meal.image_url);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching meal:', error);
        setError('שגיאה בטעינת המנה. אנא נסה שוב מאוחר יותר.');
        setLoading(false);
      }
    };

    if (id) {
      fetchMeal();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
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
    
    // If there was a previous image, restore it as the preview
    if (currentImageUrl) {
      setImagePreview(currentImageUrl);
    } else {
      setImagePreview(null);
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Create a FormData object to handle file uploads
      const mealFormData = new FormData();
      
      // Add all form fields to the FormData
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          mealFormData.append(key, formData[key]);
        }
      });
      
      // Add the image file if one was selected
      if (selectedImage) {
        mealFormData.append('image', selectedImage);
      }
      
      // Get authentication token from session storage
      const token = sessionStorage.getItem('auth_token');
      
      if (!token) {
        setMessage('נדרשת התחברות מחדש');
        navigate('/login');
        return;
      }
      
      // Send the FormData to the server with authentication token
      const response = await fetch(`http://localhost:3001/meals/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: mealFormData
        // No need to set Content-Type header for FormData, browser will set it with boundary
      });
      
      let data;
      try {
        data = await response.json();
      } catch (e) {
        console.error('Error parsing response:', e);
        throw new Error(`שגיאה בפענוח תשובת השרת: ${e.message}`);
      }
      
      if (!response.ok) {
        console.error('Server error response:', data);
        
        if (response.status === 403) {
          throw new Error('אין לך הרשאות מנהל לביצוע פעולה זו');
        } else if (response.status === 401) {
          throw new Error('נדרשת התחברות מחדש');
        } else if (response.status === 400) {
          throw new Error(`שגיאת קלט: ${data.error || 'נתונים חסרים או שגויים'}`);
        } else if (response.status === 404) {
          throw new Error(`המנה לא נמצאה במערכת`);
        } else {
          throw new Error(`שגיאה בעדכון המנה: ${data.error || `קוד שגיאה: ${response.status}`}`);
        }
      }
      
      console.log('Meal updated successfully:', data);
      
      // Show success message
      setMessage('המנה עודכנה בהצלחה!');
      
      // Clear message after 3 seconds and navigate back
      setTimeout(() => {
        navigate('/admin');
      }, 3000);
    } catch (error) {
      console.error('Error updating meal:', error);
      setMessage('שגיאה בעדכון המנה. אנא נסה שוב.');
    }
  };

  if (loading) {
    return (
      <div className="edit-meal-container">
        <header>
          <h1>✏️ עריכת מנה</h1>
          <nav>
            <Link to="/admin">דף ניהול</Link>
            <Link to="/orders">הזמנות</Link>
            <Link to="/admin/users">ניהול משתמשים</Link>
            <Link to="/admin/add-meal">הוספת מנה</Link>
          </nav>
        </header>
        <main>
          <div className="loading">טוען נתוני מנה...</div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="edit-meal-container">
        <header>
          <h1>✏️ עריכת מנה</h1>
          <nav>
            <Link to="/admin">דף ניהול</Link>
            <Link to="/orders">הזמנות</Link>
            <Link to="/admin/users">ניהול משתמשים</Link>
            <Link to="/admin/add-meal">הוספת מנה</Link>
          </nav>
        </header>
        <main>
          <div className="error-message">{error}</div>
        </main>
      </div>
    );
  }

  return (
    <div className="edit-meal-container">
      <header>
        <h1>✏️ עריכת מנה</h1>
        <nav>
          <Link to="/admin">דף ניהול</Link>
          <Link to="/orders">הזמנות</Link>
          <Link to="/admin/users">ניהול משתמשים</Link>
          <Link to="/admin/add-meal">הוספת מנה</Link>
        </nav>
      </header>

      <main>
        {message && (
          <div className="message">{message}</div>
        )}
        
        <form className="meal-form" onSubmit={handleSubmit}>
          <label>
            מזהה מנה:
            <input
              type="text"
              name="meal_id"
              value={formData.meal_id}
              onChange={handleChange}
              required
              disabled
            />
          </label>

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
                  <button type="button" onClick={handleImageReset} className="remove-image-btn">
                    {selectedImage ? 'בטל בחירה' : 'השתמש בתמונה המקורית'}
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
              min="0"
              value={formData.quantity}
              onChange={handleChange}
              required
            />
          </label>

          <div className="form-actions">
            <button type="submit" className="submit-btn">עדכן מנה</button>
            <Link to="/admin" className="cancel-link">ביטול</Link>
          </div>
        </form>
      </main>

      <footer>
        <p>&copy; 2023 מערכת ניהול מסעדה</p>
      </footer>
    </div>
  );
};

export default EditMeal;
