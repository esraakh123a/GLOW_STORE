const express = require("express");
const protect = require("../middelware/authmiddleware");
const admin = require("../middelware/adminmiddelware");

const router = express.Router();
const {
  getAllCustomers,
} = require("../controllers/authcontroller");


router.get("/profile", protect, (req, res) => {
  res.json({
    message: "You are authorized ✅",
    user: req.user,
  });
});
router.get(
  "/admin/all",
  protect,
  admin,
  getAllCustomers
);


module.exports = router;