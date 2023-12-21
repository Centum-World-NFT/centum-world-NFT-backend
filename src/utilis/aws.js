const AWS = require("aws-sdk");
const { S3 } = require("@aws-sdk/client-s3");
const multer = require("multer");
const multerS3 = require("multer-s3");
require('dotenv').config();


AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new S3({
  // Bucket is not specified here, as it's provided dynamically in multerS3
});

// Create the multer upload middleware for S3
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.BUCKET,
    acl: "public-read",
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const filename = file.originalname;
      // Constructing the key with a unique identifier and the filename
      const key = `${uniqueSuffix}-${filename}`;
      cb(null, key);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (
      file.fieldname === "video" ||
      file.fieldname === "thumbnail" ||
      file.fieldname === "pdf" ||
      file.fieldname === "profile_pic" ||
      file.fieldname === "preview_video" ||
      file.fieldname === "playlist_thumbnail"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Invalid field name for the file upload."));
    }
  },
});

module.exports = upload;
// aws.js
