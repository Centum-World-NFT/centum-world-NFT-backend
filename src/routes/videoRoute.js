const express = require("express");
const upload = require("../utilis/aws");

const {
  uploadVideo,
  fetchVideo,
  fetchOneCreatorVideos,
  selectVideo,
  likeVideo,
  dislikeVideo,
  addComment,
  addReplyToComment,
  getComments,
  getReplies,
} = require("../controllers/videoController");
const { isAuthenticated, authorizeRole } = require("../middlewares/auth");
const { fetchVideos } = require("../controllers/userController");

const router = express.Router();

//upload video
router.post(
  "/upload-video",
  upload.fields([{ name: "video" }, { name: "thumbnail" }, { name: "pdf" }]),
  isAuthenticated,
  authorizeRole(["creator"]),
  uploadVideo
);

// fetch video
router.post(
  "/fetch-video",
  isAuthenticated,
  authorizeRole(["creator", "admin", "user"]),
  fetchVideo
);

//fetch one creator video
router.post(
  "/fetch-one-creator-video",
  isAuthenticated,
  authorizeRole(["creator"]),
  fetchOneCreatorVideos
);

//select to video

router.post(
  "/select-video",
  isAuthenticated,
  authorizeRole(["creator"]),
  selectVideo
);

//fetch videos by course id

router.post(
  "/fetch-video-courseid",
  isAuthenticated,
  authorizeRole(["user", "admin"]),
  fetchVideos
);

router.put(
  "/like-video/:videoId",
  isAuthenticated,
  authorizeRole(["user", "admin", "creator"]),
  likeVideo
);
router.put(
  "/dislike-video/:videoId",
  isAuthenticated,
  authorizeRole(["user", "admin", "creator"]),
  dislikeVideo
);

//add a cooment
router.post(
  "/add-comment",
  isAuthenticated,
  authorizeRole(["user", "admin", "creator"]),
  addComment
);

//add reply to the comment
router.post(
  "/add-reply-to-comment/:commentId",
  isAuthenticated,
  authorizeRole(["user", "admin", "creator"]),
  addReplyToComment
);

router.get(
  "/get-comments/:videoId",
  isAuthenticated,
  authorizeRole(["user", "admin", "creator"]),
  getComments
);

router.get(
  "/get-replies/:commentId",
  isAuthenticated,
  authorizeRole(["user", "admin", "creator"]),
  getReplies
);

module.exports = router;
