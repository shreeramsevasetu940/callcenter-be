const Staff = require("../models/staff.js");
const cloudinary = require("../utils/cloudinary.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const StaffController = {
  // ✅ Create Staff with Image Upload
  // async createStaff(req, res) {
  //   try {
  //       const { password, ...otherData } = req.body;
  
  //       // Hash the password
  //       const hashedPassword = await bcrypt.hash(password, 10);
  
  //       const uploadedFiles = {};
  //       // Upload files to Cloudinary and store public ID
  //       for (const field in req.files) {
  //         const result = await cloudinary.uploader.upload(req.files[field][0].path);
  //         uploadedFiles[field] = { url: result.secure_url, publicId: result.public_id };
  //       }
  
  //       // Merge uploaded file URLs with request body
  //       const staffData = {
  //         ...otherData,
  //         password: hashedPassword, // Store hashed password
  //         photo: uploadedFiles["photo"] || {},
  //         personalInfo: {
  //           AdharCard: uploadedFiles["personalInfo[AdharCard]"] || {},
  //           PanCard: uploadedFiles["personalInfo[PanCard]"] || {},
  //           workExperienceCertificate: uploadedFiles["personalInfo[workExperienceCertificate]"] || {},
  //           signature: uploadedFiles["personalInfo[signature]"] || {},
  //           ...req.body.personalInfo,
  //         },
  //       };
  
  //       const staff = new Staff(staffData);
  //       await staff.save();
  //       res.status(201).json(staff);
  //     } catch (error) {
  //       console.log(error,"VEVweweve")
  //       res.status(400).json({ error: error.message });
  //     }
  //   },

  async createStaff(req, res) {
    const uploadedPublicIds = []; // To keep track of uploaded file public IDs
    try {
      const { password, ...otherData } = req.body;
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const uploadedFiles = {};
  
      // Upload files to Cloudinary and store public ID
      for (const field in req.files) {
        const result = await cloudinary.uploader.upload(req.files[field][0].path);
        uploadedFiles[field] = { url: result.secure_url, publicId: result.public_id };
        uploadedPublicIds.push(result.public_id); // Store public ID for rollback
      }
  
      // Merge uploaded file URLs with request body
      const staffData = {
        ...otherData,
        password: hashedPassword, // Store hashed password
        photo: uploadedFiles["photo"] || {},
        personalInfo: {
          AdharCard: uploadedFiles["personalInfo[AdharCard]"] || {},
          PanCard: uploadedFiles["personalInfo[PanCard]"] || {},
          workExperienceCertificate: uploadedFiles["personalInfo[workExperienceCertificate]"] || {},
          signature: uploadedFiles["personalInfo[signature]"] || {},
          ...req.body.personalInfo,
        },
      };
  
      const staff = new Staff(staffData);
      await staff.save();
      res.status(201).json(staff);
    } catch (error) {
      console.log(error, "Error while creating staff");
  
      // **Rollback - Delete uploaded files from Cloudinary**
      if (uploadedPublicIds.length > 0) {
        await Promise.all(
          uploadedPublicIds.map((publicId) => cloudinary.uploader.destroy(publicId))
        );
      }
  
      res.status(400).json({ error: error.message });
    }
  },
  

  // ✅ Get All Staff Records
  async getAllStaff(req, res) {
    try {
      const { page = 1, limit = 25, search = "",status="all"} = req.query;
      const pageNumber = parseInt(page, 25);
      const limitNumber = parseInt(limit, 25);
      // Search query
      const searchQuery = {
        ...(search && {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { phone: { $regex: search, $options: "i" } },
            { address: { $regex: search, $options: "i" } },
          ],
        }),
        ...(status !== "all" && { status }), // Add status filter only if not 'all'
      };
  

      // Fetch total count for pagination
      const totalRecords = await Staff.countDocuments(searchQuery);
  
      // Fetch paginated staff data
      const staffList = await Staff.find(searchQuery)
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber);
  
      res.status(200).json({
        totalRecords,
        totalPages: Math.ceil(totalRecords / limitNumber),
        currentPage: pageNumber,
        pageSize: limitNumber,
        staffList,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // ✅ Get Single Staff by ID
  async getStaffById(req, res) {
    try {
      const staff = await Staff.findById(req.params.id);
      if (!staff) return res.status(404).json({ message: "Staff not found" });
      res.status(200).json(staff);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // ✅ Update Staff and Manage Images
//   async updateStaff(req, res) {
//     try {
//       let staff = await Staff.findById(req.params.id);
//       if (!staff) return res.status(404).json({ message: "Staff not found" });

//       const uploadedFiles = {};

//       // Upload new files and delete old images
//       for (const field in req.files) {
//         if (staff[field]?.publicId) {
//           await cloudinary.uploader.destroy(staff[field].publicId);
//         }

//         // Upload new image
//         const result = await cloudinary.uploader.upload(req.files[field][0].path);
//         uploadedFiles[field] = { url: result.secure_url, publicId: result.public_id };
//       }

//       console.log(uploadedFiles["personalInfo[AdharCard]"],'ebriewkvnewoil')
//       // Merge uploaded files with existing staff data
//       const updatedData = {
//         ...req.body,
//         photo: uploadedFiles["photo"] || staff.photo,
//         personalInfo: {
//           ...staff.personalInfo, // Preserve existing personalInfo
//           ...req.body.personalInfo, // Merge new text data
//           AdharCard: uploadedFiles["personalInfo[AdharCard]"] || staff.personalInfo.AdharCard,
//           PanCard: uploadedFiles["personalInfo[PanCard]"] || staff.personalInfo.PanCard,
//           workExperienceCertificate:
//             uploadedFiles["personalInfo[workExperienceCertificate]"] || staff.personalInfo.workExperienceCertificate,
//           signature: uploadedFiles["personalInfo[signature]"] || staff.personalInfo.signature,
//         },
//       };

//       staff = await Staff.findByIdAndUpdate(req.params.id, updatedData, { new: true, runValidators: true });
//       res.status(200).json(staff);
//     } catch (error) {
// console.log(error,'vfskjn')

//       res.status(400).json({ error: error.message });
//     }
//   },

async updateStaff(req, res) {
  try {
    let staff = await Staff.findById(req.params.id);
    if (!staff) return res.status(404).json({ message: "Staff not found" });

    const uploadedFiles = {};

    // Upload new files and delete old images
    for (const field in req.files) {
      if (staff[field]?.publicId) {
        await cloudinary.uploader.destroy(staff[field].publicId);
      }

      // Upload new image
      const result = await cloudinary.uploader.upload(req.files[field][0].path);
      uploadedFiles[field] = { url: result.secure_url, publicId: result.public_id };
    }

    // Create update object for personalInfo
    let personalInfoUpdates = {
      ...(staff.personalInfo || {}), // Preserve existing personalInfo
      ...(req.body.personalInfo || {}), // Merge new data
    };

    // Manually update specific fields with uploaded files if available
    if (uploadedFiles["personalInfo[AdharCard]"]) {
      personalInfoUpdates.AdharCard = uploadedFiles["personalInfo[AdharCard]"];
    }
    if (uploadedFiles["personalInfo[PanCard]"]) {
      personalInfoUpdates.PanCard = uploadedFiles["personalInfo[PanCard]"];
    }
    if (uploadedFiles["personalInfo[workExperienceCertificate]"]) {
      personalInfoUpdates.workExperienceCertificate = uploadedFiles["personalInfo[workExperienceCertificate]"];
    }
    if (uploadedFiles["personalInfo[signature]"]) {
      personalInfoUpdates.signature = uploadedFiles["personalInfo[signature]"];
    }

    // Construct MongoDB update query using $set to avoid conflicts
    const updatedData = {
      ...req.body,
      photo: uploadedFiles["photo"] || staff.photo,
      "personalInfo.workExperience": req.body.personalInfo?.workExperience || staff.personalInfo?.workExperience || "",
      "personalInfo.workExperienceDescription": req.body.personalInfo?.workExperienceDescription || staff.personalInfo?.workExperienceDescription || "",
      "personalInfo.lastCompanyWhereYouWork": req.body.personalInfo?.lastCompanyWhereYouWork || staff.personalInfo?.lastCompanyWhereYouWork || "",
    };

    // Add personalInfo updates
    Object.keys(personalInfoUpdates).forEach((key) => {
      updatedData[`personalInfo.${key}`] = personalInfoUpdates[key];
    });

    // Update staff using $set
    staff = await Staff.findByIdAndUpdate(req.params.id, { $set: updatedData }, { new: true, runValidators: true });

    res.status(200).json(staff);
  } catch (error) {
    console.log(error, "Update Error");
    res.status(400).json({ error: error.message });
  }
},


  // ✅ Delete Staff and Remove Images from Cloudinary
  async deleteStaff(req, res) {
    try {
      const staff = await Staff.findById(req.params.id);
      if (!staff) return res.status(404).json({ message: "Staff not found" });

      // Delete images from Cloudinary
      if (staff.photo?.publicId) await cloudinary.uploader.destroy(staff.photo.publicId);
      if (staff.personalInfo?.AdharCard?.publicId) await cloudinary.uploader.destroy(staff.personalInfo.AdharCard.publicId);
      if (staff.personalInfo?.PanCard?.publicId) await cloudinary.uploader.destroy(staff.personalInfo.PanCard.publicId);
      if (staff.personalInfo?.workExperienceCertificate?.publicId)
        await cloudinary.uploader.destroy(staff.personalInfo.workExperienceCertificate.publicId);
      if (staff.personalInfo?.signature?.publicId) await cloudinary.uploader.destroy(staff.personalInfo.signature.publicId);

      await Staff.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Staff deleted successfully" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // ✅ login staff
  async loginStaff(req, res) {
    try {
      const { email, password } = req.body;
      // Check if staff exists
      const staff = await Staff.findOne({ email });
      if (!staff) {
        return res.status(404).json({ message: "Staff not found" });
      }
      // Compare passwords
      const isMatch = await bcrypt.compare(password, staff.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: staff._id, role: staff.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.status(200).json({
        message: "Login successful",
        data: {
          id: staff._id,
          name: staff.name,
          email: staff.email,
          role: staff.role,
          token
        },
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async updateStaffStatus(req,res){
    try {
      const {id,status}=req.params;
      const staff = await Staff.findById(id);
      if (!staff) return res.status(404).json({ message: "Staff not found" });
      await Staff.findByIdAndUpdate(id,{$set:{status}});
      res.status(200).json({ message: "Status Update successfully" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  
};

module.exports = StaffController;
