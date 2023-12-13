const express = require("express");
const { testing } = require("../controllers/paymentController");


const router = express.Router();


router.get("/testing", testing);

module.exports = router;