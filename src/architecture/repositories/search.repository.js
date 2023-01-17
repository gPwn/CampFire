const { Op } = require('sequelize');

class SearchRepository {
    #CampsModel;
    #TypesModel;
    #ReviewsModel;
    #CampAmenitiesModel;
    #EnvsModel;
    #ThemesModel;
    constructor(
        CampsModel,
        TypesModel,
        ReviewsModel,
        CampAmenitiesModel,
        EnvsModel,
        ThemesModel
    ) {
        this.#CampsModel = CampsModel;
        this.#TypesModel = TypesModel;
        this.#ReviewsModel = ReviewsModel;
        this.#CampAmenitiesModel = CampAmenitiesModel;
        this.#EnvsModel = EnvsModel;
        this.#ThemesModel = ThemesModel;
    }

    getCampLists = async (search, types, themes, env, amenities) => {
        return await this.#CampsModel.findAll({
            where: {
                [Op.or]: [
                    {
                        campName: { [Op.like]: '%' + search + '%' },
                    },
                    {
                        campAddress: { [Op.like]: '%' + search + '%' },
                    },
                ],
            },
            include: [
                {
                    where: { typeLists: { [Op.like]: '%' + types + '%' } },
                    model: this.#TypesModel,
                    as: 'Types',
                    attributes: ['typeLists'],
                },
                {
                    where: {
                        campAmenities: { [Op.like]: '%' + amenities + '%' },
                    },
                    model: this.#CampAmenitiesModel,
                    as: 'CampAmenities',
                    attributes: ['campAmenities'],
                },
                {
                    where: { envLists: { [Op.like]: '%' + env + '%' } },
                    model: this.#EnvsModel,
                    as: 'Envs',
                    attributes: ['envLists'],
                },
                {
                    where: {
                        themeLists: { [Op.like]: '%' + themes + '%' },
                    },
                    model: this.#ThemesModel,
                    as: 'Themes',
                    attributes: ['themeLists'],
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
