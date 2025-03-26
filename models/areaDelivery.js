const mongoose = require('mongoose');

const areaDeliverySchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  city: { type: String, required: true },
  deliveryBoyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', required: true },
  remark: [
    {
    _id:false,
    reason: { type: String, required: true },
    date: { type: Date, default: Date.now }, // Default date as current timestamp
    },
],
  payment: {
    online: { type: Number, default: 0 }, // Amount paid online
    cash: { type: Number, default: 0 },   // Amount paid in cash
    paymentType: {
      type: String,
      enum: ['online', 'cash', 'both'],
      required: true
    }
  }
}, { timestamps: true });

const AreaDelivery = mongoose.model('AreaDelivery', areaDeliverySchema);

module.exports = AreaDelivery;
