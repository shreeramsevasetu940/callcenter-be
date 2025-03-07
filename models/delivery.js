import mongoose from "mongoose";

const deliverySchema = new mongoose.Schema({
  orderID:{
      type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
  },
  deliveryPartner:{
    type:String,
  },
  trackingId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  trackingLink: {
    type: String,
    required: true,
    trim: true,
  },
  rtoDate: {
    type: Date,
    required: false, // Return To Origin (RTO) date, optional
  },
  deliveredDate: {
    type: Date,
    required: false, // Date when the order was delivered
  },
  feedbackCallDays: {
    type: Number,
    required: true
  },
  feedbackCallDate: {
    type: Date,
    required: false, // Date when feedback call was made
  },
  remark: [
    {
    reason: { type: String, required: true },
    date: { type: Date, default: Date.now }, // Default date as current timestamp
    },
  ],
},{
    timestamps: true,
});

const Delivery = mongoose.model("Delivery", deliverySchema);

export default Delivery;
