const express = require("express");

const {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require("../controllers/cartcontroller");

const protect = require("../middelware/authmiddleware");

const router = express.Router();

// Add product to cart
router.post("/", protect, addToCart);

// Get my cart
router.get("/", protect, getCart);

// Update cart item quantity
router.put("/:productId", protect, updateCartItem);

// Remove product from cart
router.delete("/:productId", protect, removeFromCart);

// Clear cart
router.delete("/", protect, clearCart);

module.exports = router;