const express = require('express');
const router = express.Router();
const authHostMiddleware = require('../middlewares/authHost.middleware');
const authUserMiddleware = require('../middlewares/authUser.middleware');

const BooksController = require('../architecture/controllers/books.controller');
const booksController = new BooksController();

// 캠핑장 예약하기
router.post(
    '/:campId/:siteId',
    authUserMiddleware,
    booksController.addBookscamps
);

// 호스트 예약 내역 확인
router.get(
    '/hosts/checkbooks',
    authHostMiddleware,
    booksController.getBooksByHost
);

// 유저 예약 내역 확인
router.get(
    '/users/checkbooks',
    authUserMiddleware,
    booksController.getBooksByHUser
);

module.exports = router;
