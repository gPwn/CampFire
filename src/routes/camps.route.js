const express = require('express');
const router = express.Router();
const { upload } = require('../modules/campImg.js');
const authHostMiddleware = require('../middlewares/authHost.middleware');
const authUserMiddleware = require('../middlewares/authUser.middleware');

const CampsController = require('../architecture/controllers/camps.controller.js');
const campsController = new CampsController();
// 캠핑장 등록
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
//캠핑장 사이트 목록 조회
router.get('/:campId/sites', campsController.getSiteLists);
//캠핑장 사이트 상세 조회
router.get('/:campId/sites/:siteId', campsController.getsiteById);
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
// 캠핑장 키워드 체크박스 등록
router.post(
    '/:campId/keyword',
    authHostMiddleware,
    campsController.createKeyword
);
// 캠핑장 키워드 체크박스 수정
router.put(
    '/:campId/keyword',
    authHostMiddleware,
    campsController.updateKeyword
);

module.exports = router;
