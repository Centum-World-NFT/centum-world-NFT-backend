const express = require("express");
const upload = require("../utilis/aws");

const { uploadVideo, fetchVideo } = require("../controllers/videoController");
const router = express.Router();

router.post(
  "/upload-video",
  upload.fields([{ name: "video" }, { name: "thumbnail" }, { name: "pdf" }]),
  uploadVideo
);

router.post("/fetch-video", fetchVideo);

module.exports = router;
