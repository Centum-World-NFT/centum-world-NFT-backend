const express = require('express');
const { signupCreator, creatorLogin, updateCreator } = require('../controllers/creatorController');
const router = express.Router();

router.post('/signup-creator', signupCreator);
router.post('/login-creator', creatorLogin)
router.put('/update-creator', updateCreator)


module.exports = router;
