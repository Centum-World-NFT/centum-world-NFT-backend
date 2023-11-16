const express = require('express');
const { signupCreator, creatorLogin, updateCreator, uploadProfilePic, addBioAboutMe, createSubscriber } = require('../controllers/creatorController');
const upload = require('../utilis/aws')
const router = express.Router();

router.post('/signup-creator', signupCreator);
router.post('/login-creator', creatorLogin)
router.put('/update-creator', updateCreator)
router.post('/upload-profile-pic',  upload.fields([{ name: "profile_pic" },]), uploadProfilePic)

router.post('/add-bio-about-me', addBioAboutMe)

router.post('/create-subscriber', createSubscriber)



module.exports = router;
