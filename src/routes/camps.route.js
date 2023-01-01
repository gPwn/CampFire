const express = require('express');
const router = express.Router();

const CampsController = require('../architecture/controllers/camps.controller.js');
const campsController = new CampsController();

router.put('/:campId', campsController.updateCapms);
router.delete('/:campId', campsController.updateDelete);
router.post('/:campId/books', campsController.addBookscamps);

module.exports = router;
