const SearchService = require('../services/search.service.js');

class SearchController {
    constructor() {
        this.searchService = new SearchService();
    }

    getCampLists = async (req, res, next) => {
        try {
            const searchInfo = req.query;
            const search = searchInfo.search;
            if (!searchInfo) {
                throw new InvalidParamsError();
            }

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
}

module.exports = SearchController;
