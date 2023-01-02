const express = require('express');
const router = express.Router();
const upload = require('../modules/campImg.js');

const CampsController = require('../architecture/controllers/camps.controller.js');
const campsController = new CampsController();

router.put(
    '/:campId',
    upload.fields([
        { name: 'campMainImage', maxCount: 1 },
        { name: 'campSubImages', maxCount: 10 },
    ]),
    campsController.updateCamps
);
router.delete('/:campId', campsController.deletecamps);
router.post('/:campId/books', campsController.addBookscamps);

module.exports = router;
