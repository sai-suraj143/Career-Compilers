const express = require('express');
const controller = require('./controller');
const router = express.Router();

router.get('/:tripId', controller.getLink);
router.post('/:tripId/copy', controller.copyTrip);

module.exports = router;
