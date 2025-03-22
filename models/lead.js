const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema({
 staffId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff',
    required: true
  },
name: {
    type: String,
    // required: true,
    trim: true,
},
phone: {
    type: String,
    required: true,
    match: /^[0-9]{10}$/, // Assuming it's a 10-digit mobile number
},
address: {
    type: String,
    // required: true,
},
remark: [
    {
    _id:false,
    reason: { type: String, required: true },
    date: { type: Date, default: Date.now }, // Default date as current timestamp
    },
],
},{
timestamps: true,
});

const Lead = mongoose.model("Lead", leadSchema);

module.exports = Lead;
