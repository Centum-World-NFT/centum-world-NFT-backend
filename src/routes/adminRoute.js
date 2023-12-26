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
module.exports = router;
