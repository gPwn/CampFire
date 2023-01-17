const SearchService = require('../services/search.service.js');

class SearchController {
    constructor() {
        this.searchService = new SearchService();
    }

    getCampLists = async (req, res, next) => {
        try {
            const { search } = req.body;

            let userId = 0;
            if (res.locals.userId === undefined) {
                userId = 0;
            } else {
                userId = res.locals.userId;
            }

            const getCampLists = await this.searchService.getCampLists(
                search,
                userId
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
