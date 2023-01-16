class SearchRepository {
    #CampsModel;
    #TypesModel;
    #ReviewsModel;
    constructor(CampsModel, TypesModel, ReviewsModel) {
        this.#CampsModel = CampsModel;
        this.#TypesModel = TypesModel;
        this.#ReviewsModel = ReviewsModel;
    }

    getCampLists = async ({ where }) => {
        return await this.#CampsModel.findAll({
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
    };
}

module.exports = SearchRepository;
