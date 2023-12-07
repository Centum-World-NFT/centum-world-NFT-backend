const express = require('express');

const upload = require('../utilis/aws');
const { isAuthenticated, authorizeRole } = require('../middlewares/auth');
const { signupUser, userLogin,FetchAllDataToDashboard } = require('../controllers/userController');
const router = express.Router();


//signup creator and user
router.post('/signup-user' ,signupUser);

//login creator and user
router.post('/login-user', userLogin);

router.post('/fetch-all-data-to-dashboard',FetchAllDataToDashboard)




module.exports = router;
