const express = require("express");

const {
  adminLogin,
 
} = require("../controllers/adminController");
// const { isAuthenticated, authorizeRole } = require("../middlewares/auth");
const router = express.Router();

//signup creator and user
router.post("/admin-login", adminLogin);
module.exports = router;