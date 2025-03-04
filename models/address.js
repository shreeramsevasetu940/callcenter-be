import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  pincode: {
    type: String,
    required: true,
  },
  village: {
    type: String,
    required: true,
    trim: true,
  },
  district: {
    type: String,
    required: true,
    trim: true,
  },
  taluka: {
    type: String,
    required: true,
    trim: true,
  },
  state: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
  },
  landmark: {
    type: String,
    required: false,
    trim: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  }
},{
    timestamps: true,
});

const Address = mongoose.model("Address", addressSchema);

export default Address;
