const express = require('express');

const upload = require('../utilis/aws');
const { isAuthenticated, authorizeRole } = require('../middlewares/auth');
const { signupUser, userLogin } = require('../controllers/userController');
const router = express.Router();


//signup creator and user
router.post('/signup-user' ,signupUser);

//login creator and user
router.post('/login-user', userLogin)




module.exports = router;
