const express = require("express");

const {

  createProduct,

  getProducts,

  getProductById,

  updateProduct,

  deleteProduct,

  getBestSellers,

} = require("../controllers/product");


const protect = require("../middelware/authmiddleware");

const admin = require("../middelware/adminmiddelware");

const upload = require("../middelware/uploads");


const router = express.Router();


// ===============================
// Get All Products
// ===============================

router.get("/", getProducts);


// ===============================
// Get Best Sellers
// ===============================

router.get("/best-sellers", getBestSellers);


// ===============================
// Get Product By ID
// ===============================

router.get("/:id", getProductById);


// ===============================
// Create Product - Admin
// ===============================

router.post(
  "/",
  protect,
  admin,
  upload.single("image"),
  createProduct
);


// ===============================
// Update Product - Admin
// ===============================

router.put(
  "/:id",
  protect,
  admin,
  upload.single("image"),
  updateProduct
);


// ===============================
// Delete Product - Admin
// ===============================

router.delete(
  "/:id",
  protect,
  admin,
  deleteProduct
);


module.exports = router;