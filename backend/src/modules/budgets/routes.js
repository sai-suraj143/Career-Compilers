const express = require('express');
const controller = require('./controller');
const router = express.Router();

router.get('/summary/:userId', controller.getSummary);
router.get('/:tripId', controller.get);
router.put('/:tripId', controller.update);

module.exports = router;
