const express = require('express');
const router = express.Router();

const {
        registerUser,
        loginUser,
        verifyUserOtp,
        resendOtp,
        isAuthenticated,
        forgotPassword,
        resetPassword,
        checkResetLink
    } = require('../controller/authController');

router.route('/isAuthenticated').get(isAuthenticated);
router.route('/register').post(registerUser);
router.route('/verify').post(verifyUserOtp);
router.route('/resendOtp').post(resendOtp);
router.route('/login').post(loginUser);
router.route('/forgot-password').post(forgotPassword);
router.route('/reset-password').post(resetPassword);
router.route('/validate-password-reset-link/:id').get(checkResetLink);
module.exports = router;
