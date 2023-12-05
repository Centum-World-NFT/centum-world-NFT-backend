const express = require("express");
const upload = require("../utilis/aws");

const { uploadVideo, fetchVideo, fetchOneCreatorVideos, selectVideo } = require("../controllers/videoController");
const { isAuthenticated, authorizeRole } = require("../middlewares/auth");

const router = express.Router();


//upload video
router.post(
  "/upload-video",
  upload.fields([{ name: "video" }, { name: "thumbnail" }, { name: "pdf" }]),isAuthenticated,authorizeRole(["creator"]),
  uploadVideo
);

// fetch video
router.post("/fetch-video",isAuthenticated,authorizeRole(["creator"]), fetchVideo);

//fetch one creator video
router.post("/fetch-one-creator-video",isAuthenticated,authorizeRole(["creator"]),fetchOneCreatorVideos);

//select to video

router.post("/select-video",isAuthenticated,authorizeRole(["creator"]), selectVideo);

module.exports = router;



