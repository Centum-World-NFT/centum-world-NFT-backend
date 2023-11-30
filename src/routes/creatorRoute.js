const express = require('express');
const { signupCreatorAndUser, creatorAndUserLogin, updateCreator, uploadProfilePic, addBioAboutMe, createSubscriber, fetchSubscriber, blockAndUnblockSubscriber, fetchSubscriberByFilter,fetchCreaterDetails } = require('../controllers/creatorController');
const upload = require('../utilis/aws');
const { isAuthenticated, authorizeRole } = require('../middlewares/auth');
const router = express.Router();


//signup creator and user
router.post('/signup-creator-and-user' ,signupCreatorAndUser);

//login creator and user
router.post('/login-creator-and-user', creatorAndUserLogin)

// update creator
router.put('/update-creator',isAuthenticated,authorizeRole(["creator"]), updateCreator)

//upload profile pic
router.post('/upload-profile-pic',  upload.fields([{ name: "profile_pic" },]),isAuthenticated,authorizeRole(["creator"]), uploadProfilePic)

//add-bio about me
router.post('/add-bio-about-me',isAuthenticated,authorizeRole(["creator"]), addBioAboutMe)

// create subscribe
router.post('/create-subscriber',isAuthenticated,authorizeRole(["creator"]), createSubscriber)
//fetch-subscriber
router.post('/fetch-subscriber', isAuthenticated,authorizeRole(["creator"]),fetchSubscriber)
router.post('/block-and-unblock-subscriber', isAuthenticated,authorizeRole(["creator"]),blockAndUnblockSubscriber)
router.post('/fetch-subscriber-by-filter',isAuthenticated,authorizeRole(["creator"]), fetchSubscriberByFilter)
router.post('/fetch-creater-details',isAuthenticated,authorizeRole(["creator"]),fetchCreaterDetails)



module.exports = router;
