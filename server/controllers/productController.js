
const Product = require("../models/Product");

// ============================
// GET ALL PRODUCTS
// ============================

const getProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true })
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Get Products Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
};

// ============================
// GET SINGLE PRODUCT
// ============================

const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Get Product Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch product",
    });
  }
};

// ============================
// CREATE PRODUCT
// ============================

const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      image,
      stock,
    } = req.body || {};

    if (!name || !description || price === undefined || !category) {
      return res.status(400).json({
        success: false,
        message: "Name, description, price and category are required",
      });
    }

    const product = await Product.create({
      name,
      description,
      price,
      category,
      image: image || "",
      stock: stock || 0,
      createdBy: req.user.userId,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Create Product Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================
// UPDATE PRODUCT
// ============================

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const {
      name,
      description,
      price,
      category,
      image,
      stock,
      isActive,
    } = req.body || {};

    product.name = name ?? product.name;
    product.description = description ?? product.description;
    product.price = price ?? product.price;
    product.category = category ?? product.category;
    product.image = image ?? product.image;
    product.stock = stock ?? product.stock;
    product.isActive = isActive ?? product.isActive;

    await product.save();

    res.json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Update Product Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to update product",
    });
  }
};

// ============================
// DELETE PRODUCT
// ============================

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await product.deleteOne();

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete Product Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to delete product",
    });
  }
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
