const Product = require("../models/Product");

const ProductController = {
  // ✅ Create Product
  async createProduct(req, res) {
    try {
      const { name, price } = req.body;
      const newProduct = await Product.create({ name, price });
      res.status(201).json({ success: true, data: newProduct });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // ✅ Get All Products
  async getAllProducts(req, res) {
    try {
      const { page = 1, limit = 25, search = ""} = req.query;
      const pageNumber = parseInt(page, 25);
      const limitNumber = parseInt(limit, 25);
      // Search query
      const searchQuery = {
      ...(search && {
          $or: [
          { name: { $regex: search, $options: "i" } },
          ],
      })
      };

      // Fetch total count for pagination
      const totalRecords = await Product.countDocuments(searchQuery);
  
      // Fetch paginated Product data
      const productList = await Product.find(searchQuery)
        .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);
  
      res.status(200).json({
      totalRecords,
      totalPages: Math.ceil(totalRecords / limitNumber),
      currentPage: pageNumber,
      pageSize: limitNumber,
      productList,
      });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
  },

  // ✅ Get Product by ID
  async getProductById(req, res) {
    try {
      const { id } = req.params;
      const product = await Product.findById(id);
      if (!product) return res.status(404).json({ success: false, message: "Product not found" });
      res.status(200).json({ success: true, data: product });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // ✅ Update Product
  async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
      if (!updatedProduct) return res.status(404).json({ success: false, message: "Product not found" });
      res.status(200).json({ success: true, data: updatedProduct });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // ✅ Delete Product
  async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      const deletedProduct = await Product.findByIdAndDelete(id);
      if (!deletedProduct) return res.status(404).json({ success: false, message: "Product not found" });
      res.status(200).json({ success: true, message: "Product deleted successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
};

module.exports = ProductController;
