const express = require('express')
const route = express.Router();
const auth = require('../middleware/auth')
const StaffController = require('../controllers/staff')
const upload = require("../middleware/multer");
//available routes

// Create Staff
// Create Staff with file upload
route.post("/", upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "personalInfo[AdharCard]", maxCount: 1 },
    { name: "personalInfo[PanCard]", maxCount: 1 },
    { name: "personalInfo[workExperienceCertificate]", maxCount: 1 },
    { name: "personalInfo[signature]", maxCount: 1 }
  ]), StaffController.createStaff);

// Read all Staff
route.get("/", StaffController.getAllStaff);

// Read single Staff by ID
route.get("/:id", StaffController.getStaffById);

// Update Staff
route.put("/:id", upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "personalInfo[AdharCard]", maxCount: 1 },
    { name: "personalInfo[PanCard]", maxCount: 1 },
    { name: "personalInfo[workExperienceCertificate]", maxCount: 1 },
    { name: "personalInfo[signature]", maxCount: 1 }
  ]), StaffController.updateStaff);

// Delete Staff
route.delete("/:id", StaffController.deleteStaff);

// Staff Login
route.post("/login", StaffController.loginStaff);

module.exports = route;
