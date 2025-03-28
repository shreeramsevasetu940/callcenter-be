const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema({
  staffId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff'
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  products: [
    {
      _id:false,
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product", // Reference to Product model
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      qty: {
        type: Number,
        required: true,
        min: 1, // Minimum quantity should be 1
      },
      price: {
        type: Number,
        required: true,
      }
    }
  ],
  price: {
    type: Number,
    required: true,
  },
  address: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address", // Reference to Address model
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  orderStatus: {
    type: String,
    enum: ["Pending", "Dispatch", "Delivered", "Cancelled", "RTO"],
    default: "Pending", // Default status when order is placed
  },
  deliveryPartner:{
    type:String,
    enum: ["Delhivery", "I-Think","Indian-Post","Area-Delivery"]
  }
}, {
  timestamps: true,
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;

// name,product,price,address,phone,deliveryPartner