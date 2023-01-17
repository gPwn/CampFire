const SearchService = require('../services/search.service.js');

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

            if (types !== undefined) {
                types = types.split(',');
            } else {
                types = [];
            }

            if (themes !== undefined) {
                themes = themes.split(',');
            } else {
                themes = [];
            }

            if (envs !== undefined) {
                envs = envs.split(',');
            } else {
                envs = [];
            }

            if (amenities !== undefined) {
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

    getCampListsByHash = async (req, res, next) => {
        const { search } = req.body;

        const getCampListsByHash = await this.searchService.getCampListsByHash(
            search
        );
    };
}

module.exports = SearchController;
