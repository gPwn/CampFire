const express = require('express');
const router = express.Router();
const authUserMiddleware = require('../middlewares/authUser.middleware.js');

const LikesController = require('../architecture/controllers/likes.controller.js');
const likesController = new LikesController();

// 유저 찜하기 기능
router.put('/:campId', authUserMiddleware, likesController.addLike);
// 유저 찜하기 취소 기능
router.put('/:campId', authUserMiddleware, likesController.deleteLike);

module.exports = router;
