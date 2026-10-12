const express = require("express");
const router = express.Router();

const {
  addToFavorites,
  removeFromFavorites,
  getFavorites
} = require("../controllers/authcontroller");

const authMiddleware = require("../middelware/authmiddleware");

// Get my favorites
router.get("/", authMiddleware, getFavorites);

// Add product to favorites
router.post("/:productId", authMiddleware, addToFavorites);

// Remove product from favorites
router.delete("/:productId", authMiddleware, removeFromFavorites);

module.exports = router;