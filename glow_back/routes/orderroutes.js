const express = require("express");

const {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/ordercontroller");

const protect = require("../middelware/authmiddleware");
const admin = require("../middelware/adminmiddelware");

const router = express.Router();

// ===============================
// Admin Routes
// ===============================

router.get("/admin/all", protect, admin, getAllOrders);

router.put("/admin/:id/status", protect, admin, updateOrderStatus);


// ===============================
// User Routes
// ===============================

router.post("/", protect, createOrder);

router.get("/", protect, getMyOrders);

router.get("/:id", protect, getOrderById);

router.put("/:id/cancel", protect, cancelOrder);

module.exports = router;