const Address = require("../models/address");

const AddressController = {
  // ✅ Create Address
  async createAddress(req, res) {
    try {
      const address = await Address.create(req.body);
      res.status(201).json({ success: true, data: address });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // ✅ Get All Addresses
  async getAllAddresses(req, res) {
    try {
        const { page = 1, limit = 25, search = ""} = req.query;
        const pageNumber = parseInt(page, 25);
        const limitNumber = parseInt(limit, 25);
        // Search query
        const searchQuery = {
        ...(search && {
            $or: [
            { pincode: { $regex: search, $options: "i" } },
            { village: { $regex: search, $options: "i" } },
            { district: { $regex: search, $options: "i" } },
            { taluka: { $regex: search, $options: "i" } },
            { state: { $regex: search, $options: "i" } },
            { phone: { $regex: search, $options: "i" } },
            { landmark: { $regex: search, $options: "i" } },
            { address: { $regex: search, $options: "i" } },
            ],
        })
        };

        // Fetch total count for pagination
        const totalRecords = await Address.countDocuments(searchQuery);
    
        // Fetch paginated Address data
        const addressList = await Address.find(searchQuery)
          .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber);
    
        res.status(200).json({
        totalRecords,
        totalPages: Math.ceil(totalRecords / limitNumber),
        currentPage: pageNumber,
        pageSize: limitNumber,
        addressList,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
  },

  // ✅ Get Address by ID
  async getAddressById(req, res) {
    try {
      const address = await Address.findById(req.params.id);
      if (!address) return res.status(404).json({ success: false, message: "Address not found" });
      res.status(200).json({ success: true, data: address });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // ✅ Update Address by ID
  async updateAddress(req, res) {
    try {
      const address = await Address.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!address) return res.status(404).json({ success: false, message: "Address not found" });
      res.status(200).json({ success: true, data: address });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // ✅ Delete Address by ID
  async deleteAddress(req, res) {
    try {
      const address = await Address.findByIdAndDelete(req.params.id);
      if (!address) return res.status(404).json({ success: false, message: "Address not found" });
      res.status(200).json({ success: true, message: "Address deleted successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
};

module.exports = AddressController;