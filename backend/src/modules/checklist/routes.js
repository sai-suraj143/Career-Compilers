const express = require('express');
const controller = require('./controller');
const router = express.Router();

router.get('/recent/:userId', controller.getRecent);
router.get('/trip/:tripId', controller.getByTripId);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);

module.exports = router;
