const express = require('express');
const { signupCreator, creatorLogin } = require('../controllers/creatorController');
const router = express.Router();

router.post('/signup-creator', signupCreator);
router.post('/login-creator', creatorLogin)

module.exports = router;
