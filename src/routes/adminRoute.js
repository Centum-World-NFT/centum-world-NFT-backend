const express = require("express");

const {
  adminLogin,
  getAllUsersCount,
  getTotalAmount,
  getAllCreatorCount,
  getAllSubscriberCount,
  getAllCreators,
  getSubscriberDetails,
  fetchTransactionHistoryForAllUsers,
  getEveryMonthRevenue,
  getEveryMonthPaidUserCount,
  getAllUsers,
  getPlayListOfCreator,
  blockAndUnblockUser,
  deleteUser,
  fetchPlaylists,
  blockAndUnblockCreator,
  deleteCreator,
  fetchSubscriberCourse,
  everyMonthNumberOfNewUsersAndNewSubscribers,
  fetchVideosByCourseId,
  verifyCreator,
  verifySubscriber,
  totalCourses,
  mostPurchasedCourse
} = require("../controllers/adminController");
const { isAuthenticated, authorizeRole } = require("../middlewares/auth");
const { fetchTransactionHistory } = require("../controllers/userController");

// const { isAuthenticated, authorizeRole } = require("../middlewares/auth");
const router = express.Router();

//signup creator and user
router.post("/admin-login", adminLogin);
//All user coount details

router.get(
  "/get-user-count",
  isAuthenticated,
  authorizeRole(["admin"]),
  getAllUsersCount
);

router.get(
  "/get-creator-count",
  isAuthenticated,
  authorizeRole(["admin"]),
  getAllCreatorCount
);
router.get(
  "/get-all-creator",
  isAuthenticated,
  authorizeRole(["admin"]),
  getAllCreators
);

router.get(
  "/get-subscriber-count",
  isAuthenticated,
  authorizeRole(["admin"]),
  getAllSubscriberCount
);

router.get(
  "/get-all-subscriber",
  isAuthenticated,
  authorizeRole(["admin"]),
  getSubscriberDetails
);

router.get(
  "/get-total-amount",
  isAuthenticated,
  authorizeRole(["admin"]),
  getTotalAmount
);
// fetch Transaction History For All Users

router.get(
  "/fetch-transaction-history-for-all-users",
  isAuthenticated,
  authorizeRole(["admin"]),
  fetchTransactionHistoryForAllUsers
);

router.get(
  "/get-every-month-revenue",
  isAuthenticated,
  authorizeRole(["admin"]),
  getEveryMonthRevenue
);
router.get(
  "/get-every-month-paid-user-count",
  isAuthenticated,
  authorizeRole(["admin"]),
  getEveryMonthPaidUserCount
);

//getAllUsers

router.get(
  "/get-all-users",
  isAuthenticated,
  authorizeRole(["admin"]),
  getAllUsers
);

router.get(
  "/get-all-creator-playlist/:id",
  isAuthenticated,
  authorizeRole(["admin"]),
  getPlayListOfCreator
);

router.put(
  "/block-and-unblock-user/:userId",
  isAuthenticated,
  authorizeRole(["admin"]),
  blockAndUnblockUser
);

router.put(
  "/block-and-unblock-creator/:creatorId",
  isAuthenticated,
  authorizeRole(["admin"]),
  blockAndUnblockCreator
);

router.put(
  "/delete-creator/:creatorId",
  isAuthenticated,
  authorizeRole(["admin"]),
  deleteCreator
);

router.put(
  "/delete-user/:userId",
  isAuthenticated,
  authorizeRole(["admin"]),
  deleteUser
);

router.get(
  "/fetch-playlists",
  fetchPlaylists
);


router.get(
  "/fetch-subscriber-course/:id",
  isAuthenticated,
  authorizeRole(["admin"]),
  fetchSubscriberCourse
);

router.get(
  "/every-month-number-of-new-users-and-new-subscribers",
  isAuthenticated,
  authorizeRole(["admin"]),
  everyMonthNumberOfNewUsersAndNewSubscribers
)

router.get(
  "/fetch-videos-by-course-id/:id",
  isAuthenticated,
  authorizeRole(["admin", "creator"]),
  fetchVideosByCourseId
)

router.put(
  "/verify-creator/:id",
  isAuthenticated,
  authorizeRole(["admin"]),
  verifyCreator
)

router.put(
  "/verify-subscriber/:id",
  isAuthenticated,
  authorizeRole(["admin"]),
  verifySubscriber
)

router.get(
  "/total-courses",
  isAuthenticated,
  authorizeRole(["admin"]),
  totalCourses
)

router.get(
  "/most-purchased-course",
  isAuthenticated,
  authorizeRole("admin"),
  mostPurchasedCourse
)




module.exports = router;
