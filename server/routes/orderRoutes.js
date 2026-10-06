const express = require("express");

const {
  createOrder,
  getMyOrders,
  getOrder,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/orderController");

const {
  authenticate,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Customer
router.use(authenticate);

router.post("/", createOrder);

router.get("/my-orders", getMyOrders);

router.get("/:id", getOrder);

router.put("/:id/cancel", cancelOrder);

// Admin / Manager
router.get(
  "/admin/all",
  authorize("superadmin", "manager"),
  getAllOrders
);

router.put(
  "/admin/:id/status",
  authorize("superadmin", "manager"),
  updateOrderStatus
);

module.exports = router;