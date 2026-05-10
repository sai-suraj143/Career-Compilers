const express = require('express');
const controller = require('./controller');
const router = express.Router();

router.get('/profile', controller.getProfile);
router.put('/profile', controller.updateProfile);

module.exports = router;
