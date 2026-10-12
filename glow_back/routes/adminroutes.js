const express = require("express");

const {
  getDashboardStats,
   getRecentOrders,
   getSalesOverview
} = require("../controllers/admincontroller");

const protect = require("../middelware/authmiddleware");
const admin = require("../middelware/adminmiddelware");

const router = express.Router();

// ===============================
// Admin Dashboard
// ===============================

router.get(
  "/dashboard",
  protect,
  admin,
  getDashboardStats
);
// Recent Orders
router.get(
  "/recent-orders",
  protect,
  admin,
  getRecentOrders
);
// Sales Overview
router.get(
  "/sales-overview",
  protect,
  admin,
  getSalesOverview
);

module.exports = router;