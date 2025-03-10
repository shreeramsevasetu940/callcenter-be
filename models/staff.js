const mongoose = require('mongoose');
const staffSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  branch: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["employee", "admin", "manager", "couriermanager", "teamleader"],
    default: "employee",
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    match: /^[0-9]{10}$/, // Assuming it's a 10-digit mobile number
  },
  password: {
    type: String,
    required: true,
  },
  otp: {
    type: String, // OTP for authentication
    required: false,
  },
  address: {
    type: String,
    required: true,
  },
  photo: {
    url: { type: String },
    publicId: { type: String }, // Store publicId for Cloudinary
  },
  joiningDate: {
    type: Date,
    required: true,
  },
  companyMobileNo: {
    type: String,
    required: false,
  },
  personalInfo: {
    AdharCard: {
      url: { type: String },
      publicId: { type: String },
    },
    PanCard: {
      url: { type: String },
      publicId: { type: String },
    },
    workExperienceCertificate: {
      url: { type: String },
      publicId: { type: String },
    },
    signature: {
      url: { type: String },
      publicId: { type: String },
    },
    workExperience: { type: String, required: true },
    workExperienceDescription: { type: String, required: false },
    lastCompanyWhereYouWork: { type: String, required: false },
  },
  bankDetail: {
    fullName: { type: String, required: true },
    ifscCode: { type: String, required: true },
    accountNumber: { type: String, required: true },
    branch: { type: String, required: true },
    bankName: { type: String, required: true },
  },
  status:{
    type: String,
    enum: ['active', 'inactive', 'suspend'],
    default: 'active'
  }
}, {
  timestamps: true,
});

const Staff = mongoose.model("Staff", staffSchema);

module.exports = Staff;