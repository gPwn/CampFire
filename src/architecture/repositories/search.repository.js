class SearchRepository {
    #CampsModel;
    #TypesModel;
    #ReviewsModel;
    constructor(CampsModel, TypesModel, ReviewsModel) {
        this.#CampsModel = CampsModel;
        this.#TypesModel = TypesModel;
        this.#ReviewsModel = ReviewsModel;
    }

    getCampLists = async ({ offset, limit, where }) => {
        const getCampLists = await this.#CampsModel.findAll({
            offset,
            limit,
            where,
            include: [
                {
                    model: this.#TypesModel,
                    as: 'Types',
                    attributes: ['typeLists'],
                },
                {
                    model: this.#ReviewsModel,
                    as: 'Reviews',
                    attributes: ['reviewId'],
                },
            ],
            order: [['likes', 'DESC']],
        });
        if (getCampLists.length === 0) {
            return false;
        } else {
            return getCampLists;
        }
    };
}

module.exports = SearchRepository;
