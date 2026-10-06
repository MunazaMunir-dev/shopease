const Cart = require("../models/Cart");
const Product = require("../models/Product");

// GET CART
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({
      user: req.user.userId,
    }).populate("items.product");

    if (!cart) {
      cart = await Cart.create({
        user: req.user.userId,
        items: [],
      });
    }

    res.json({
      success: true,
      cart,
    });
  } catch (error) {
    console.error("Get Cart Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch cart",
    });
  }
};

// ADD TO CART
const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body || {};

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const product = await Product.findById(productId);

    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const qty = quantity || 1;

    if (qty > product.stock) {
      return res.status(400).json({
        success: false,
        message: "Insufficient stock",
      });
    }

    let cart = await Cart.findOne({
      user: req.user.userId,
    });

    if (!cart) {
      cart = await Cart.create({
        user: req.user.userId,
        items: [
          {
            product: productId,
            quantity: qty,
          },
        ],
      });
    } else {
      const existingItem = cart.items.find(
        (item) => item.product.toString() === productId
      );

      if (existingItem) {
        existingItem.quantity += qty;
      } else {
        cart.items.push({
          product: productId,
          quantity: qty,
        });
      }

      await cart.save();
    }

    await cart.populate("items.product");

    res.status(201).json({
      success: true,
      message: "Product added to cart",
      cart,
    });
  } catch (error) {
    console.error("Add Cart Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to add product to cart",
    });
  }
};

// UPDATE CART ITEM
const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body || {};

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    const cart = await Cart.findOne({
      user: req.user.userId,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const item = cart.items.find(
      (item) => item.product.toString() === req.params.productId
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Product not in cart",
      });
    }

    item.quantity = quantity;

    await cart.save();
    await cart.populate("items.product");

    res.json({
      success: true,
      message: "Cart updated successfully",
      cart,
    });
  } catch (error) {
    console.error("Update Cart Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to update cart",
    });
  }
};

// REMOVE FROM CART
const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      user: req.user.userId,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== req.params.productId
    );

    await cart.save();
    await cart.populate("items.product");

    res.json({
      success: true,
      message: "Product removed from cart",
      cart,
    });
  } catch (error) {
    console.error("Remove Cart Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to remove product from cart",
    });
  }
};

// CLEAR CART
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      user: req.user.userId,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.items = [];

    await cart.save();

    res.json({
      success: true,
      message: "Cart cleared successfully",
    });
  } catch (error) {
    console.error("Clear Cart Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to clear cart",
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};