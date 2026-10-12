const User = require("../models/users");
const Product = require("../models/product");
const Order = require("../models/order");
const Contact = require("../models/contact");

// ===============================
// Get Admin Dashboard Statistics
// ===============================
const getDashboardStats = async (req, res) => {
  try {
    // Count products
    const totalProducts = await Product.countDocuments();

    // Count normal users only
    const totalCustomers = await User.countDocuments({
      role: "user",
    });

    // Count all orders
    const totalOrders = await Order.countDocuments();

    // Count pending orders
    const pendingOrders = await Order.countDocuments({
      orderStatus: "pending",
    });

    // Count unread messages
    const unreadMessages = await Contact.countDocuments({
      status: "unread",
    });

    // Calculate total sales
    const salesResult = await Order.aggregate([
      {
        $match: {
          orderStatus: {
            $ne: "cancelled",
          },
        },
      },
      {
        $group: {
          _id: null,
          totalSales: {
            $sum: "$totalPrice",
          },
        },
      },
    ]);

    const totalSales =
      salesResult.length > 0
        ? salesResult[0].totalSales
        : 0;

    res.status(200).json({
      totalProducts,
      totalCustomers,
      totalOrders,
      pendingOrders,
      unreadMessages,
      totalSales,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error getting dashboard statistics",
      error: error.message,
    });
  }
};
// ===============================
// Get Recent Orders - Admin
// ===============================
const getRecentOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product", "name image")
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      orders,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error getting recent orders",
      error: error.message,
    });
  }
};
// ===============================
// Sales Overview - Admin
// ===============================
const getSalesOverview = async (req, res) => {
  try {
    const sales = await Order.aggregate([
      {
        $match: {
          orderStatus: {
            $ne: "cancelled",
          },
        },
      },

      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          totalSales: {
            $sum: "$totalPrice",
          },
          totalOrders: {
            $sum: 1,
          },
        },
      },

      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);

    res.status(200).json({
      sales,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error getting sales overview",
      error: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
  getRecentOrders,
  getSalesOverview
};