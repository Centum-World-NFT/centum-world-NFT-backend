const express = require("express");

const {
  adminLogin,
  getAllUsersCount,
  getTotalAmount
} = require("../controllers/adminController");
const { isAuthenticated, authorizeRole } = require("../middlewares/auth");
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
  "/get-total-amount",
  isAuthenticated,
  authorizeRole(["admin"]),
  getTotalAmount
);
module.exports = router;
