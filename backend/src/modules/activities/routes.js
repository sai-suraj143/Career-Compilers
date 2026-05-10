const express = require('express');
const controller = require('./controller');
const router = express.Router();

router.get('/search', controller.search);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);

module.exports = router;
