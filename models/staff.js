import mongoose from "mongoose";
const staffSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  branch:{
    type: String,
    required: true,
  },
  role:{
    type: String,
    enum:["employee", "admin","manager","couriermanager","teamleader"],
    default:"employee",
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
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
    type: String, // Store URL or base64 string of the photo
    required: false,
  },
  joiningDate: {
    type: Date,
    required: true,
  },
  companyMobileNo:{
    type: String,
    required: false,
  },
  personalInfo:{
    AdharCard: { type: String, required: true },
    PanCard: { type: String, required: true },
    workExperience:{type: String,required:true},
    workExperienceDescription:{type: String, required:false},
    workExperienceCertificate:{type: String, required:false},
    lastCompanyWhereYouWork:{type: String, required:false},
    signature: {type: String,required: false}
  },
  bankDetail: {
    fullName: { type: String, required: true },
    ifscCode: { type: String, required: true },
    accountNumber: { type: String, required: true },
    branch: { type: String, required: true },
    bankName: { type: String, required: true },
  },
},{
    timestamps: true,
});

const Staff = mongoose.model("Staff", staffSchema);

export default Staff;
