const express = require("express");

const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const {
  authenticate,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Public
router.get("/", getProducts);
router.get("/:id", getProduct);

// SuperAdmin + Manager
router.post(
  "/",
  authenticate,
  authorize("superadmin", "manager"),
  createProduct
);

router.put(
  "/:id",
  authenticate,
  authorize("superadmin", "manager"),
  updateProduct
);

router.delete(
  "/:id",
  authenticate,
  authorize("superadmin", "manager"),
  deleteProduct
);

module.exports = router;