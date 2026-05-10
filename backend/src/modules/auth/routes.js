const express = require('express');
const validate = require('../../middlewares/validate.middleware');
const authValidation = require('./validation');
const authController = require('./controller');

const router = express.Router();

router.post('/signup', validate(authValidation.signup), authController.signup);
router.post('/login', validate(authValidation.login), authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/logout', authController.logout);

module.exports = router;
