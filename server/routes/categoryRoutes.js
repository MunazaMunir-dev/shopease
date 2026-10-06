const express = require("express");

const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

const {
  authenticate,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Public
router.get("/", getCategories);

// SuperAdmin + Manager
router.post(
  "/",
  authenticate,
  authorize("superadmin", "manager"),
  createCategory
);

router.put(
  "/:id",
  authenticate,
  authorize("superadmin", "manager"),
  updateCategory
);

router.delete(
  "/:id",
  authenticate,
  authorize("superadmin", "manager"),
  deleteCategory
);

module.exports = router;