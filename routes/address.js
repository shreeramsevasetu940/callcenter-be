const express = require('express')
const route = express.Router();
const {verify} = require('../middleware/auth')
const AddressController = require('../controllers/address')
// Create Address
route.post("/",verify, AddressController.createAddress);

// Get All Addresses
route.get("/",verify, AddressController.getAllAddresses);

// Get Single Address by ID
route.get("/:id",verify, AddressController.getAddressById);

// Update Address by ID
route.put("/:id",verify, AddressController.updateAddress);

// Delete Address by ID
route.delete("/:id",verify, AddressController.deleteAddress);

module.exports = route;