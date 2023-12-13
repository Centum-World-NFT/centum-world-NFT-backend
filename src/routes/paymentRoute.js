const express = require("express");
const { paymentCourse } = require("../controllers/payment/paymentController");
const router = express.Router();
router.post("/create-payment", paymentCourse);

module.exports = router;