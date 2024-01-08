const express = require("express");
const {
  signupCreator,
  creatorLogin,
  updateCreator,
  uploadProfilePic,
  addBioAboutMe,
  fetchCreaterDetails,
  createPlaylist,
  fetchPlaylistOfCreator,
  uploadCreatorProfilePic,
  fetchMySubscribers,
  fetchPlaylist,
  updatePlaylist,
  deletePlaylist,
  totalNoOfPlaylistsSubscribersRevenue,
  bestCourseOfCreator,
} = require("../controllers/creatorController");
const upload = require("../utilis/aws");
const { isAuthenticated, authorizeRole } = require("../middlewares/auth");
const router = express.Router();

//signup creator and user
router.post("/signup-creator", signupCreator);

//login creator and user
router.post("/login-creator", creatorLogin);

// update creator
router.put(
  "/update-creator",
  isAuthenticated,
  authorizeRole(["creator"]),
  updateCreator
);

//upload profile pic
router.post(
  "/upload-profile-pic",
  upload.fields([{ name: "profile_pic" }]),
  isAuthenticated,
  authorizeRole(["creator"]),
  uploadProfilePic
);

//add-bio about me
router.post(
  "/add-bio-about-me",
  isAuthenticated,
  authorizeRole(["creator"]),
  addBioAboutMe
);

router.post(
  "/fetch-creater-details",
  isAuthenticated,
  authorizeRole(["creator"]),
  fetchCreaterDetails
);

router.post(
  "/create-playlist",
  upload.fields([{ name: "preview_video" }, { name: "playlist_thumbnail" }]),
  isAuthenticated,
  authorizeRole(["creator"]),
  createPlaylist
);

router.post(
  "/fetch-playlists",
  isAuthenticated,
  authorizeRole([ "creator"]),
  fetchPlaylistOfCreator
);

// uploadCreatorProfilePic

router.put(
  "/upload-creator-profile-pic",
  upload.fields([{ name: "profile_pic" }]),
  isAuthenticated,
  authorizeRole(["creator"]),
  uploadCreatorProfilePic
);

//fetch my subscribers

router.post(
  "/fetch-my-subscribers",
  isAuthenticated,
  authorizeRole(["creator"]),
  fetchMySubscribers
);

//fetch specific playlist
router.get(
  "/fetch-playlist/:id",
  isAuthenticated,
  authorizeRole(["creator"]),
  fetchPlaylist
);
//update specific playlist
router.put(
  "/update-playlist",
  upload.fields([{ name: "preview_video" }, { name: "playlist_thumbnail" }]),
  isAuthenticated,
  authorizeRole(["creator"]),
  updatePlaylist
);

router.delete(
  "/delete-playlist/:id",
  isAuthenticated,
  authorizeRole(["creator"]),
  deletePlaylist
);

router.get(
  "/total-no-of-playlists-subscribers-revenue",
  isAuthenticated,
  authorizeRole(["creator"]),
  totalNoOfPlaylistsSubscribersRevenue
);

router.get(
  "/best-course-of-creator",
  isAuthenticated,
  authorizeRole(["creator"]),
  bestCourseOfCreator
);



module.exports = router;
