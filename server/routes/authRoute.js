/**
 * Authentication routes for user login, registration, and password reset
 */
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const dbSingleton = require('../dbSingleton');
const { generateToken } = require('../middleware/auth');

// Get database connection
const db = dbSingleton.getConnection();

/**
 * User login
 * POST /auth/login
 */
router.post('/login', async (req, res) => {
  console.log('Login request received:', { email: req.body.email });
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      console.log('Login validation failed: missing email or password');
      return res.status(400).json({
        success: false,
        message: 'אנא הזן אימייל וסיסמה'
      });
    }

    console.log('Querying database for user:', email);
    // Check if user exists
    db.query(
      'SELECT * FROM users WHERE email = ?',
      [email],
      async (err, results) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({
            success: false,
            message: 'שגיאת שרת פנימית'
          });
        }

        // User not found
        if (results.length === 0) {
          console.log('User not found:', email);
          return res.status(401).json({
            success: false,
            message: 'אימייל או סיסמה שגויים'
          });
        }
        
        console.log('User found:', { email, userId: results[0].user_id });

        const user = results[0];

        // Check if password exists in the user record
        if (!user.password) {
          console.error('User has no password set:', email);
          return res.status(401).json({
            success: false,
            message: 'חשבון לא מוגדר כראוי, אנא צור קשר עם מנהל המערכת'
          });
        }
        
        console.log('Attempting password comparison for user:', email);
        console.log('Password from database exists:', !!user.password);
        
        // Compare password
        try {
          console.log('Comparing provided password with stored hash');
          const isMatch = await bcrypt.compare(password, user.password);
          console.log('Password match result:', isMatch);
          
          if (!isMatch) {
            console.log('Password does not match for user:', email);
            return res.status(401).json({
              success: false,
              message: 'אימייל או סיסמה שגויים'
            });
          }
          
          console.log('Password verified successfully for user:', email);
        } catch (error) {
          console.error('Password comparison error:', error);
          return res.status(500).json({
            success: false,
            message: 'שגיאה באימות סיסמה'
          });
        }

        // Generate JWT token
        console.log('Generating JWT token for user:', user.user_id);
        const token = generateToken(user);
        console.log('Token generated successfully');

        // Remove password from user object
        delete user.password;

        // Return token and user data
        console.log('Sending successful login response');
        res.json({
          success: true,
          token,
          user
        });
        console.log('Login process completed successfully for user:', user.email);
      }
    );
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'שגיאת שרת פנימית'
    });
  }
});

/**
 * User registration
 * POST /auth/register
 */
router.post('/register', async (req, res) => {
  try {
    const { email, password, first_name, last_name, phone, age } = req.body;

    // Validate input
    if (!email || !password || !first_name || !last_name) {
      return res.status(400).json({
        success: false,
        message: 'אנא מלא את כל השדות הנדרשים'
      });
    }

    // Check if user already exists
    db.query(
      'SELECT * FROM users WHERE email = ?',
      [email],
      async (err, results) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({
            success: false,
            message: 'שגיאת שרת פנימית'
          });
        }

        // User already exists
        if (results.length > 0) {
          return res.status(400).json({
            success: false,
            message: 'משתמש עם אימייל זה כבר קיים'
          });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user with a generated user_id
        const userId = 'u' + Math.floor(100000 + Math.random() * 900000); // Generate a random user_id like 'u123456'
        
        const newUser = {
          user_id: userId,
          email,
          password: hashedPassword,
          first_name,
          last_name,
          phone: phone || '',
          age: age || null,
          user_type: 'user' // Default user type
        };

        // Insert user into database
        db.query(
          'INSERT INTO users SET ?',
          newUser,
          (err, result) => {
            if (err) {
              console.error('Database error:', err);
              console.error('SQL query:', 'INSERT INTO users SET ?', newUser);
              return res.status(500).json({
                success: false,
                message: 'שגיאת שרת פנימית: ' + err.message
              });
            }

            // Remove password from user object
            delete newUser.password;

            // Generate JWT token
            const token = generateToken(newUser);

            // Return token and user data
            res.status(201).json({
              success: true,
              message: 'משתמש נרשם בהצלחה',
              token,
              user: newUser
            });
          }
        );
      }
    );
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'שגיאת שרת פנימית'
    });
  }
});

/**
 * Password reset request
 * POST /auth/reset-password
 */
router.post('/reset-password', (req, res) => {
  try {
    const { email } = req.body;

    // Validate input
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'אנא הזן אימייל'
      });
    }

    // Check if user exists
    db.query(
      'SELECT * FROM users WHERE email = ?',
      [email],
      (err, results) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({
            success: false,
            message: 'שגיאת שרת פנימית'
          });
        }

        // Always return success to prevent email enumeration
        res.json({
          success: true,
          message: 'אם האימייל קיים במערכת, הוראות לאיפוס סיסמה נשלחו לתיבת הדואר שלך'
        });

        // In a real application, you would send an email with a password reset link
        // For now, just log that a reset was requested
        if (results.length > 0) {
          console.log(`Password reset requested for: ${email}`);
        }
      }
    );
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({
      success: false,
      message: 'שגיאת שרת פנימית'
    });
  }
});

module.exports = router;
