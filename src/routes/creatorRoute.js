const express = require('express');
const { signupCreator, creatorLogin, updateCreator, uploadProfilePic, addBioAboutMe, createSubscriber, fetchSubscriber, blockAndUnblockSubscriber, fetchSubscriberByFilter,fetchCreaterDetails } = require('../controllers/creatorController');
const upload = require('../utilis/aws');
const { isAuthenticated, authorizeRole } = require('../middlewares/auth');
const router = express.Router();


//signup creator and user
router.post('/signup-creator' ,signupCreator);

//login creator and user
router.post('/login-creator', creatorLogin)

// update creator
router.put('/update-creator',isAuthenticated,authorizeRole(["creator"]), updateCreator)

//upload profile pic
router.post('/upload-profile-pic',  upload.fields([{ name: "profile_pic" },]),isAuthenticated,authorizeRole(["creator"]), uploadProfilePic)

//add-bio about me
router.post('/add-bio-about-me',isAuthenticated,authorizeRole(["creator"]), addBioAboutMe)




router.post('/fetch-creater-details',isAuthenticated,authorizeRole(["creator"]),fetchCreaterDetails)



module.exports = router;
