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

module.exports = router;
