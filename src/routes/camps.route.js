const express = require('express');
const router = express.Router();
const { upload } = require('../modules/campImg.js');
const authHostMiddleware = require('../middlewares/authHost.middleware');
const authUserMiddleware = require('../middlewares/authUser.middleware');

const CampsController = require('../architecture/controllers/camps.controller.js');
const campsController = new CampsController();

// 캠핑장 업로드
router.post(
    '/',
    upload.fields([
        { name: 'campMainImage', maxCount: 1 },
        { name: 'campSubImages', maxCount: 10 },
    ]),
    authHostMiddleware,
    campsController.createCamp
);
// 캠핑장 페이지 조회
router.get('/page', campsController.getCampsByPage);
// 캠핑장 상세 조회
router.get('/:campId', campsController.getCampById);
// 캠핑장 수정
router.patch(
    '/:campId',
    upload.fields([
        { name: 'campMainImage', maxCount: 1 },
        { name: 'campSubImages', maxCount: 10 },
    ]),
    authHostMiddleware,
    campsController.updateCamps
);
// 캠핑장 삭제
router.delete('/:campId', authHostMiddleware, campsController.deletecamps);
// 캠핑장 예약하기
// router.post(
//     '/:campId/books',
//     authUserMiddleware,
//     campsController.addBookscamps
// );

module.exports = router;
