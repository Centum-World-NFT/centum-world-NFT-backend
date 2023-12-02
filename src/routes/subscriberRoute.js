const express = require("express");
const upload = require("../utilis/aws");
const { createSubscriber, fetchSubscriber, blockAndUnblockSubscriber, fetchSubscriberByFilter } = require("../controllers/subscriberController")

const { isAuthenticated, authorizeRole } = require("../middlewares/auth")

const router = express.Router();

// create subscribe
router.post('/create-subscriber',isAuthenticated,authorizeRole(["creator"]), createSubscriber)
//fetch-subscriber
router.post('/fetch-subscriber', isAuthenticated,authorizeRole(["creator"]),fetchSubscriber)
router.post('/block-and-unblock-subscriber', isAuthenticated,authorizeRole(["creator"]),blockAndUnblockSubscriber)
router.post('/fetch-subscriber-by-filter',isAuthenticated,authorizeRole(["creator"]), fetchSubscriberByFilter)

module.exports = router;
