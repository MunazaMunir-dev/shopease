const Category = require("../models/Category");

// GET ALL CATEGORIES
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: categories.length,
      categories,
    });
  } catch (error) {
    console.error("Get Categories Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
    });
  }
};

// CREATE CATEGORY
const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body || {};

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const existingCategory = await Category.findOne({
      name: name.trim(),
    });

    if (existingCategory) {
      return res.status(409).json({
        success: false,
        message: "Category already exists",
      });
    }

    const category = await Category.create({
      name,
      description: description || "",
      createdBy: req.user.userId,
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    console.error("Create Category Error:", error.message);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE CATEGORY
const updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const { name, description, isActive } = req.body || {};

    category.name = name ?? category.name;
    category.description = description ?? category.description;
    category.isActive = isActive ?? category.isActive;

    await category.save();

    res.json({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    console.error("Update Category Error:", error.message);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE CATEGORY
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    await category.deleteOne();

    res.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Delete Category Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to delete category",
    });
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};