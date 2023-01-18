const SearchService = require('../services/search.service.js');
const {
    InvalidParamsError,
} = require('../../middlewares/exceptions/error.class.js');

class SearchController {
    constructor() {
        this.searchService = new SearchService();
    }

    getCampLists = async (req, res, next) => {
        try {
            let userId = 0;
            if (res.locals.userId === undefined) {
                userId = 0;
            } else {
                userId = res.locals.userId;
            }

            const searchInfo = req.query;
            const search = searchInfo.search;
            let types = searchInfo.types;
            let themes = searchInfo.themes;
            let envs = searchInfo.envs;
            let amenities = searchInfo.amenities;

            if (!searchInfo) {
                throw new InvalidParamsError();
            }

            if (types === '') {
                types = [];
            } else {
                types = types.split(',');
            }

            if (themes !== '') {
                themes = themes.split(',');
            } else {
                themes = [];
            }

            if (envs !== '') {
                envs = envs.split(',');
            } else {
                envs = [];
            }

            if (amenities !== '') {
                amenities = amenities.split(',');
            } else {
                amenities = [];
            }

            const getCampLists = await this.searchService.getCampLists(
                userId,
                search,
                types,
                themes,
                envs,
                amenities
            );

            res.status(201).json({
                getCampLists,
            });
        } catch (error) {
            next(error);
        }
    };
}

module.exports = SearchController;
