const express = require('express');
const router = express.Router();

const {
        registerUser,
        loginUser,
        verifyUserOtp,
        resendOtp
    } = require('../controller/authController');

router.route('/register').post(registerUser);
router.route('/verify').post(verifyUserOtp);
router.route('/resendOtp').post(resendOtp);
router.route('/login').post(loginUser);
module.exports = router;
