//Lana Nabwani
//Merna Saeed
//49/3

const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const dbSingleton = require("./dbSingleton");
const { verifyToken, isAdmin } = require("./middleware/auth");
const { errorHandler, notFound } = require("./middleware/errorHandler");

// Get database connection
const db = dbSingleton.getConnection();

// Create uploads directory structure if it doesn't exist
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Create subdirectories for different types of uploads
const uploadSubdirs = ["meals", "profiles", "documents", "images"];
uploadSubdirs.forEach((dir) => {
  const subDir = path.join(uploadsDir, dir);
  if (!fs.existsSync(subDir)) {
    fs.mkdirSync(subDir, { recursive: true });
  }
});

const app = express();

// Configure CORS to allow credentials with specific origin
const corsOptions = {
  origin: 'http://localhost:3000', // Frontend URL
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200 // For legacy browser support
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

// Serve static files from the uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Serve favicon
app.get("/favicon.ico", (req, res) => {
  res.status(204).end(); // No content response for favicon requests
});

// Root route handler
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Sketsot API Server", status: "running" });
});

// Import routes
const authRoutes = require("./routes/authRoute");
const userRoutes = require("./routes/userRoute");
const mealsRoutes = require("./routes/mealsRoute");
const ordersRoutes = require("./routes/ordersRoute");
const categoryMealRoutes = require("./routes/categoryMealRoute");
const orderMealRoutes = require("./routes/orderMealRoute");
const contactRoute = require("./routes/contactRoute");
const settingsRoutes = require("./routes/settingsRoute");

// Use routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/meals", mealsRoutes);
app.use("/orders", ordersRoutes);
app.use("/category_meal", categoryMealRoutes);
app.use("/order_meal", orderMealRoutes);
app.use("/contact", contactRoute);
app.use("/settings", settingsRoutes);

// Public routes

// Get all categories
app.get("/categories", (req, res) => {
  db.query("SELECT * FROM categories", (err, results) => {
    if (err)
      return res.status(500).json({ error: err.message, success: false });
    res.json({ data: results, success: true });
  });
});

// Get all meals
app.get("/meals", (req, res) => {
  db.query("SELECT * FROM meals", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// Protected routes - require authentication

// Get user orders
app.get("/orders/user", verifyToken, (req, res) => {
  const userId = req.user.user_id;

  db.query(
    "SELECT o.*, m.meal_name, m.price FROM orders o JOIN meals m ON o.meal_id = m.meal_id WHERE o.user_id = ?",
    [userId],
    (err, results) => {
      if (err)
        return res.status(500).json({ error: err.message, success: false });
      res.json({ data: results, success: true });
    }
  );
});

// Add order - protected
app.post("/orders", verifyToken, (req, res) => {
  const { meal_id, quantity, status } = req.body;
  const user_id = req.user.user_id;

  const query =
    "INSERT INTO orders (user_id, meal_id, quantity, status, order_date) VALUES (?, ?, ?, ?, NOW())";
  db.query(
    query,
    [user_id, meal_id, quantity, status || "pending"],
    (err, result) => {
      if (err)
        return res.status(500).json({ error: err.message, success: false });
      res.status(201).json({ success: true, id: result.insertId });
    }
  );
});

// Admin routes - require admin privileges

// Get all orders - admin only
app.get("/orders", isAdmin, (req, res) => {
  db.query(
    "SELECT o.*, u.first_name, u.last_name, u.email, m.meal_name FROM orders o JOIN users u ON o.user_id = u.user_id JOIN meals m ON o.meal_id = m.meal_id ORDER BY o.order_date DESC",
    (err, results) => {
      if (err)
        return res.status(500).json({ error: err.message, success: false });
      res.json({ data: results, success: true });
    }
  );
});

// Update order status - admin only
app.put("/orders/:id", isAdmin, (req, res) => {
  const { status } = req.body;
  const orderId = req.params.id;

  db.query(
    "UPDATE orders SET status = ? WHERE order_id = ?",
    [status, orderId],
    (err, result) => {
      if (err)
        return res.status(500).json({ error: err.message, success: false });
      if (result.affectedRows === 0)
        return res
          .status(404)
          .json({ error: "Order not found", success: false });
      res.json({ success: true, message: "Order updated successfully" });
    }
  );
});

// Add error handling middleware at the end
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION! Shutting down...");
  console.error(err.name, err.message);
  process.exit(1);
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION! Shutting down...");
  console.error(err.name, err.message);
  process.exit(1);
});
