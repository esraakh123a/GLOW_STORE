const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config();
const connectDB = require('./config/db');
 const authroutes = require("./routes/authroutes");
 const userRoutes = require("./routes/userroutes");
 const productRoutes = require("./routes/product");
 const cartRoutes = require("./routes/cartroute");
 const orderRoutes = require("./routes/orderroutes");
 const contactRoutes = require("./routes/contactroutes");
 const favoriteRoutes = require("./routes/favoriteroutes");
 const adminRoutes = require("./routes/adminroutes");


const app = express();


// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
// Auth Routes
app.use("/api/auth",authroutes);
// User Routes
app.use("/api/user",userRoutes);
// Product Routes
app.use("/api/products",productRoutes);
// Cart Routes
app.use("/api/cart",cartRoutes);
// Order Routes
app.use("/api/order",orderRoutes);
// Contact Routes
app.use("/api/contact",contactRoutes);
// Favorite Routes
app.use("/api/favorites",favoriteRoutes);
//admin routes
app.use("/api/admin", adminRoutes);

// Uploads
app.use("/uploads", express.static("uploads"));
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);
// Test Route
app.get('/', (req, res) => {
  res.send('Shoppy Store Backend is Running 🚀');
});

// Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

   
