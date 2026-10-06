require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");

const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const passport = require("./config/passport");
const {
  authenticate,
  authorize,
} = require("./middleware/authMiddleware");

const app = express();

// ============================
// MIDDLEWARE
// ============================

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
// ============================
// RATE LIMITING
// ============================

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many authentication requests. Try again later.",
  },
});

// ============================
// AUTH ROUTES
// ============================

app.use("/api/auth", authLimiter, authRoutes);

// ============================
// PRODUCT ROUTES
// ============================

app.use("/api/products", productRoutes);

// ============================
// CATEGORY ROUTES
// ============================

app.use("/api/categories", categoryRoutes);
   

app.use("/api/cart", cartRoutes);


app.use("/api/orders", orderRoutes);
// ============================
// RBAC TEST ROUTE
// ============================

app.get(
  "/api/admin/test",
  authenticate,
  authorize("superadmin", "manager"),
  (req, res) => {
    res.json({
      success: true,
      message: "Admin area accessed successfully",
      user: req.user,
    });
  }
);

// ============================
// TEST ROUTE
// ============================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "ShopEase API is running",
  });
});

// ============================
// DATABASE CONNECTION
// ============================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((error) => {
    console.error("MongoDB Error:", error.message);
  });

if (require.main === module) {
  app.listen(process.env.PORT || 5000, () => {
    console.log(
      `Server running on port ${process.env.PORT || 5000}`
    );
  });
}

module.exports = app;