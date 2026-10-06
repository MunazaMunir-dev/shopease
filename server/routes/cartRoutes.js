const express = require("express");

const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require("../controllers/cartController");

const { authenticate } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authenticate);

router.get("/", getCart);

router.post("/add", addToCart);

router.put("/update/:productId", updateCartItem);

router.delete("/remove/:productId", removeFromCart);

router.delete("/clear", clearCart);

module.exports = router;