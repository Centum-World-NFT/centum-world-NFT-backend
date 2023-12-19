const express = require("express");
const { createPayment ,verifyPayment} = require("../controllers/paymentController");
const { isAuthenticated, authorizeRole } = require("../middlewares/auth");


const router = express.Router();


router.post("/create-payment", isAuthenticated, authorizeRole(["user"]), createPayment);
router.post("/verify",isAuthenticated, authorizeRole(["user"]), verifyPayment)

module.exports = router;