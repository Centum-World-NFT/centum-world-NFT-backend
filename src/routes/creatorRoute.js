const express = require('express');
const { signupCreator, creatorLogin, updateCreator, uploadProfilePic, addBioAboutMe, createSubscriber, fetchSubscriber, blockAndUnblockSubscriber, fetchSubscriberByFilter,fetchCreaterDetails } = require('../controllers/creatorController');
const upload = require('../utilis/aws');
const { isAuthenticated, authorizeRole } = require('../middlewares/auth');
const router = express.Router();


//signup creator
router.post('/signup-creator' ,signupCreator);

//login creator
router.post('/login-creator', creatorLogin)

// update creator
router.put('/update-creator',isAuthenticated,authorizeRole(["creator"]), updateCreator)

//upload profile pic
router.post('/upload-profile-pic',  upload.fields([{ name: "profile_pic" },]),isAuthenticated,authorizeRole(["creator"]), uploadProfilePic)

//add-bio about me
router.post('/add-bio-about-me',isAuthenticated,authorizeRole(["creator"]), addBioAboutMe)

// create subscribe
router.post('/create-subscriber',isAuthenticated,authorizeRole(["creator"]), createSubscriber)
//fetch-subscriber
router.post('/fetch-subscriber', fetchSubscriber)
router.post('/block-and-unblock-subscriber', blockAndUnblockSubscriber)
router.post('/fetch-subscriber-by-filter', fetchSubscriberByFilter)
router.post('/fetch-creater-details',fetchCreaterDetails)



module.exports = router;
