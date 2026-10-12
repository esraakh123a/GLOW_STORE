const Cart = require("../models/cart");
const Product = require("../models/product");

// ===============================
// Add Product To Cart
// ===============================
const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        message: "Not enough stock",
      });
    }

    let cart = await Cart.findOne({
      user: req.user.id,
    });

    if (!cart) {
      cart = await Cart.create({
        user: req.user.id,
        items: [
          {
            product: productId,
            quantity: quantity || 1,
          },
        ],
      });
    } else {
      const existingItem = cart.items.find(
        (item) => item.product.toString() === productId
      );

      if (existingItem) {
        const newQuantity =
          existingItem.quantity + (quantity || 1);

        if (newQuantity > product.stock) {
          return res.status(400).json({
            message: "Not enough stock",
          });
        }

        existingItem.quantity = newQuantity;
      } else {
        cart.items.push({
          product: productId,
          quantity: quantity || 1,
        });
      }

      await cart.save();
    }

    res.status(200).json({
      message: "Product added to cart successfully",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error adding product to cart",
      error: error.message,
    });
  }
};

// ===============================
// Get My Cart
// ===============================
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      user: req.user.id,
    }).populate("items.product");

    if (!cart) {
      return res.status(200).json({
        cart: {
          items: [],
          totalPrice: 0,
        },
      });
    }

    let totalPrice = 0;

    const items = cart.items.map((item) => {
      const product = item.product;

      const finalPrice =
        product.price -
        (product.price * product.discount) / 100;

      const itemTotal = finalPrice * item.quantity;

      totalPrice += itemTotal;

      return {
        product,
        quantity: item.quantity,
        finalPrice,
        itemTotal,
      };
    });

    res.status(200).json({
      cart: {
        _id: cart._id,
        user: cart.user,
        items,
        totalPrice,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error getting cart",
      error: error.message,
    });
  }
};

// ===============================
// Update Cart Item Quantity
// ===============================
const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;

    const cart = await Cart.findOne({
      user: req.user.id,
    });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    const item = cart.items.find(
      (item) => item.product.toString() === req.params.productId
    );

    if (!item) {
      return res.status(404).json({
        message: "Product not found in cart",
      });
    }

    const product = await Product.findById(
      req.params.productId
    );

    // Product doesn't exist
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // Quantity must be at least 1
    if (quantity < 1) {
      return res.status(400).json({
        message: "Quantity must be at least 1",
      });
    }

    // Check stock
    if (quantity > product.stock) {
      return res.status(400).json({
        message: "Not enough stock",
      });
    }

    // Update quantity
    item.quantity = quantity;

    await cart.save();

    res.status(200).json({
      message: "Cart item updated successfully",
      cart,
    });

  } catch (error) {

    res.status(500).json({
      message: "Error updating cart",
      error: error.message,
    });

  }
};

// ===============================
// Remove Product From Cart
// ===============================
const removeFromCart = async (req, res) => {

  try {

    const cart = await Cart.findOne({
      user: req.user.id,
    });

    if (!cart) {

      return res.status(404).json({
        message: "Cart not found",
      });

    }

    cart.items = cart.items.filter(
      (item) =>
        item.product.toString() !== req.params.productId
    );

    await cart.save();

    // Get updated cart with product details
    const updatedCart = await Cart.findOne({
      user: req.user.id,
    }).populate("items.product");

    let totalPrice = 0;

    const items = updatedCart.items.map((item) => {

      const product = item.product;

      const discount = product.discount || 0;

      const finalPrice =
        product.price -
        (product.price * discount) / 100;

      const itemTotal =
        finalPrice * item.quantity;

      totalPrice += itemTotal;

      return {
        product,
        quantity: item.quantity,
        finalPrice,
        itemTotal,
      };

    });

    res.status(200).json({

      message: "Product removed from cart successfully",

      cart: {
        _id: updatedCart._id,
        user: updatedCart.user,
        items,
        totalPrice,
      },

    });

  } catch (error) {

    res.status(500).json({
      message: "Error removing product from cart",
      error: error.message,
    });

  }

};

// ===============================
// Clear Cart
// ===============================
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      user: req.user.id,
    });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    cart.items = [];

    await cart.save();

    res.status(200).json({
      message: "Cart cleared successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error clearing cart",
      error: error.message,
    });
  }
};

module.exports = {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};