const express = require('express');
const controller = require('./controller');
const router = express.Router();

router.post('/', controller.create);
router.get('/:tripId', controller.getByTrip);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);

module.exports = router;
