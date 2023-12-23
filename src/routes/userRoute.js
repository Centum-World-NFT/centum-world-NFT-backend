const express = require("express");

const upload = require("../utilis/aws");
const { isAuthenticated, authorizeRole } = require("../middlewares/auth");
const {
  signupUser,
  userLogin,
  FetchAllDataToDashboard,
  fetchAllVidhyamData,
  myCourse,
  fetchMyCourse,
  updateUser,
  uploadUserProfilePic,
  getUser,
  fetchTransactionHistory,
  createWishlist,
  fetchWishlist,
  deleteWishlist,
} = require("../controllers/userController");
const router = express.Router();

//signup creator and user
router.post("/signup-user", signupUser);

//login creator and user
router.post("/login-user", userLogin);

router.post(
  "/fetch-all-data-to-dashboard",
  isAuthenticated,
  authorizeRole(["user"]),
  FetchAllDataToDashboard
);

router.post(
  "/fetch-all-vidhyam-data",
  isAuthenticated,
  authorizeRole(["user"]),
  fetchAllVidhyamData
);

// create my course

router.post("/my-course", isAuthenticated, authorizeRole(["user"]), myCourse);

//fetch my course
router.post(
  "/fetch-my-course",
  isAuthenticated,
  authorizeRole(["user"]),
  fetchMyCourse
);

//update user
router.put(
  "/update-user",
  isAuthenticated,
  authorizeRole(["user"]),
  updateUser
);

//uplaod profile pic

router.put(
  "/upload-profile-pic",
  upload.fields([{ name: "profile_pic" }]),
  isAuthenticated,
  authorizeRole(["user"]),
  uploadUserProfilePic
);

// get user details

router.post("/get-user", isAuthenticated, authorizeRole(["user"]), getUser);

//get user transaction history details
router.get("/fetch-transaction-history", isAuthenticated, authorizeRole(["user"]), fetchTransactionHistory);

//create wishlist
router.post("/create-wishlist", isAuthenticated, authorizeRole(["user"]), createWishlist);

//fetch wishlist
router.get("/fetch-wishlist", isAuthenticated, authorizeRole(["user"]), fetchWishlist);

//delete wishlist
router.post("/delete-wishlist", isAuthenticated, authorizeRole(["user"]),deleteWishlist);





module.exports = router;
