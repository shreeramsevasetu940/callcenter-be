const Order = require("../models/Order");

const OrderController = {
    // ✅ Create Order
    async createOrder(req, res) {
        try {
            const staffId = req.user.id
            const order = await Order.create({...req.body,staffId});
            res.status(201).json({ success: true, data: order });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    // ✅ Get All Orders
    async getAllOrders(req, res) {
        try {
            const { page = 1, limit = 25, search = ""} = req.query;
            const pageNumber = parseInt(page, 25);
            const limitNumber = parseInt(limit, 25);
            // Search query
            const searchQuery = {
            ...(search && {
                $or: [
                { name: { $regex: search, $options: "i" } },
                { phone: { $regex: search, $options: "i" } },
                { address: { $regex: search, $options: "i" } },
                ],
            })
            };

            // Fetch total count for pagination
            const totalRecords = await Order.countDocuments(searchQuery);
        
            // Fetch paginated Order data
            const orderList = await Order.find(searchQuery).populate("product").populate("address").populate("staffId")
              .skip((pageNumber - 1) * limitNumber)
            .limit(limitNumber);
        
            res.status(200).json({
            totalRecords,
            totalPages: Math.ceil(totalRecords / limitNumber),
            currentPage: pageNumber,
            pageSize: limitNumber,
            orderList,
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // ✅ Get Single Order
    async getOrderById(req, res) {
        try {
            const order = await Order.findById(req.params.id).populate("product.name").populate("address").populate("staffId");
            if (!order) return res.status(404).json({ success: false, error: "Order not found" });
            res.status(200).json({ success: true, data: order });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    // ✅ Update Order
    async updateOrder(req, res) {
        try {
            const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!updatedOrder) return res.status(404).json({ success: false, error: "Order not found" });
            res.status(200).json({ success: true, data: updatedOrder });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    // ✅ Delete Order
    async deleteOrder(req, res) {
        try {
            const deletedOrder = await Order.findByIdAndDelete(req.params.id);
            if (!deletedOrder) return res.status(404).json({ success: false, error: "Order not found" });
            res.status(200).json({ success: true, message: "Order deleted successfully" });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },
};

module.exports = OrderController;