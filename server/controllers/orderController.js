const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

// CREATE ORDER
const createOrder = async (req, res) => {
  try {
    const { shippingAddress } = req.body || {};

    if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        message: "Shipping address is required",
      });
    }

    const cart = await Cart.findOne({
      user: req.user.userId,
    }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    let totalAmount = 0;

    const orderItems = [];

    for (const item of cart.items) {
      const product = item.product;

      if (!product || !product.isActive) {
        return res.status(400).json({
          success: false,
          message: "One of the products is no longer available",
        });
      }

      if (item.quantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}`,
        });
      }

      totalAmount += product.price * item.quantity;

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
      });
    }

    const order = await Order.create({
      user: req.user.userId,
      items: orderItems,
      totalAmount,
      shippingAddress,
      status: "pending",
    });

    // Reduce product stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: {
          stock: -item.quantity,
        },
      });
    }

    // Empty cart
    cart.items = [];
    await cart.save();

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.error("Create Order Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to create order",
    });
  }
};

// GET MY ORDERS
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user.userId,
    })
      .populate("items.product", "name price")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get Orders Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};

// GET SINGLE ORDER
const getOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user.userId,
    }).populate("items.product", "name price");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Get Order Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch order",
    });
  }
};

// CANCEL ORDER
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (["shipped", "delivered", "cancelled"].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: "Order cannot be cancelled",
      });
    }

    order.status = "cancelled";

    await order.save();

    res.json({
      success: true,
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    console.error("Cancel Order Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to cancel order",
    });
  }
};

// ADMIN GET ALL ORDERS
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email role")
      .populate("items.product", "name price")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get All Orders Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch all orders",
    });
  }
};

// ADMIN UPDATE ORDER STATUS
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body || {};

    const validStatuses = [
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.status = status;

    await order.save();

    res.json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("Update Order Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to update order status",
    });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrder,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
};