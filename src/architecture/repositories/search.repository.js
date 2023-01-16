const { Camps, Reviews, Types } = require('../../models');

class SearchRepository {
    constructor() {}

    getCampLists = async ({ where }) => {
        return await Camps.findAll({
            where,
            include: [
                {
                    model: Types,
                    as: 'Types',
                    attributes: ['typeLists'],
                },
                {
                    model: Reviews,
                    as: 'Reviews',
                    attributes: ['reviewId'],
                },
            ],
            order: [['likes', 'DESC']],
        });
    };
}

module.exports = SearchRepository;
