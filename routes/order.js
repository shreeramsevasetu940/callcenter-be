const express = require('express')
const route = express.Router();
const {verify} = require('../middleware/auth')
const OrderController = require('../controllers/order')
// Create Order
route.post('/',verify, OrderController.createOrder);

// Get All Orders
route.get('/',verify, OrderController.getAllOrders);

// Get Order by ID
route.get('/:id',verify, OrderController.getOrderById);

// Update Order
route.put('/:id',verify, OrderController.updateOrder);

// Delete Order
route.delete('/:id',verify, OrderController.deleteOrder);

module.exports = route;