const express = require('express');
const router = express.Router();
const { upload } = require('../modules/campImg.js');
const authHostMiddleware = require('../middlewares/authHost.middleware');
const authUserMiddleware = require('../middlewares/authUser.middleware');

const CampsController = require('../architecture/controllers/camps.controller.js');
const campsController = new CampsController();

// 캠핑장 페이지 조회
router.get('/page', campsController.getCampsByPage);
// 캠핑장 상세 조회
router.get('/:campId', campsController.getCampById);
//캠핑장 사이트 목록 조회
router.get('/:campId/sites', campsController.getSiteLists);
//캠핑장 사이트 상세 조회
router.get('/:campId/sites/:siteId', campsController.getsiteById);

module.exports = router;
