const express = require('express')
const route = express.Router();
const {verify} = require('../middleware/auth')
const ProductController = require('../controllers/product')

// Create Product
route.post('/',verify, ProductController.createProduct);

// Get All Products
route.get('/',verify, ProductController.getAllProducts);

// Get Product by ID
route.get('/:id',verify, ProductController.getProductById);

// Update Product
route.put('/:id',verify, ProductController.updateProduct);

// Delete Product
route.delete('/:id',verify, ProductController.deleteProduct);

module.exports = route;