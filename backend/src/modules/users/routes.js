const express = require('express');
const controller = require('./controller');
const router = express.Router();

router.get('/:id', controller.getProfile);
router.put('/:id', controller.updateProfile);

module.exports = router;
