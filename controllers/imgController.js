// controllers/imgController.js

require("dotenv").config();
const { S3Client } = require("@aws-sdk/client-s3");
const multer = require("multer");
const multerS3 = require("multer-s3");

// AWS S3 client
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Set up multer to upload directly to S3
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE, // 👈 Auto-set the correct content-type
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      cb(null, `products/${Date.now()}-${file.originalname}`);
    },
  }),
});

// Upload function (Controller)
exports.uploadImg = (req, res) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      return res.status(500).json({ status: 500, message: "File upload failed", error: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ status: 400, message: "No file uploaded" });
    }
    return res.status(200).json({
      status: 200,
      message: "Image uploaded successfully",
      imageUrl: req.file.location,
    });
  });
};
