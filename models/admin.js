const mongoose = require('mongoose');
const adminSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff'
  }
}, {
    timestamps: true,
})
module.exports = mongoose.model('Admin', adminSchema)
