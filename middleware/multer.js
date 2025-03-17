// const multer = require("multer");

// const storage = multer.diskStorage({});
// const upload = multer({ storage });

// module.exports = upload;

const multer = require("multer");
const storage = multer.diskStorage({});
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Optional: Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    const allowedFields = [
      "photo",
      "personalInfo[AdharCard]",
      "personalInfo[PanCard]",
      "personalInfo[workExperienceCertificate]",
      "personalInfo[signature]",
    ];

    if (allowedFields.includes(file.fieldname)) {
      cb(null, true);
    } else {
      cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', file.fieldname));
    }
  }
});

module.exports = upload;
