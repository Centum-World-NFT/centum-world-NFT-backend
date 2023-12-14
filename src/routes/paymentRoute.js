const express = require("express");
const { createPayment ,verifyPayment} = require("../controllers/paymentController");


const router = express.Router();


router.post("/create-payment", createPayment);
router.post("/verify", verifyPayment)

module.exports = router;