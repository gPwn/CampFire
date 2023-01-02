const express = require('express');
const router = express.Router();
const upload = require('../modules/campImg.js');
const authHostMiddleware = require('../middlewares/authHost.middleware');
const authUserMiddleware = require('../middlewares/authUser.middleware');

const CampsController = require('../architecture/controllers/camps.controller.js');
const campsController = new CampsController();

router.put(
    '/:campId',
    upload.fields([
        { name: 'campMainImage', maxCount: 1 },
        { name: 'campSubImages', maxCount: 10 },
    ]),
    authHostMiddleware,
    campsController.updateCamps
);
router.delete('/:campId', authHostMiddleware, campsController.deletecamps);
router.post(
    '/:campId/books',
    authUserMiddleware,
    campsController.addBookscamps
);

module.exports = router;
