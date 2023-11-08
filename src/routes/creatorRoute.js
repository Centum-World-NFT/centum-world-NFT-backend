const express = require('express');
const { signupCreator } = require('../controllers/creatorController');
const router = express.Router();

router.post('/signup-creator', signupCreator);

module.exports = router;
