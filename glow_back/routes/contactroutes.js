const express = require("express");

const router = express.Router();

const {
  sendMessage,
  getAllMessages,
  getMessageById,
  markAsRead
} = require("../controllers/contactcontroller");

const protect = require("../middelware/authmiddleware");
const admin = require("../middelware/adminmiddelware");


// ===============================
// Send Message - User
// ===============================

router.post("/", sendMessage);


// ===============================
// Admin Messages
// ===============================

// Get all messages
router.get(
  "/admin/all",
  protect,
  admin,
  getAllMessages
);


// Get one message
router.get(
  "/admin/:id",
  protect,
  admin,
  getMessageById
);


// Mark message as read
router.put(
  "/admin/:id/read",
  protect,
  admin,
  markAsRead
);


module.exports = router;