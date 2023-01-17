const express = require('express');
const router = express.Router();

const SearchController = require('../architecture/controllers/search.controller.js');
const searchController = new SearchController();

const likeConfirmUserHostMiddleware = require('../middlewares/likeConfirmUserHost.middleware');

// 통합 검색 기능
router.get(
    '/camps',
    likeConfirmUserHostMiddleware,
    searchController.getCampLists
);

// 해시태그 검색 기능
router.get(
    '/hash',
    /*likeConfirmUserHostMiddleware,*/
    searchController.getCampListsByHash
);

module.exports = router;
