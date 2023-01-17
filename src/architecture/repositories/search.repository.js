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
                    model: this.#CampAmenitiesModel,
                    as: 'CampAmenities',
                    attributes: [],
                },
                {
                    model: this.#EnvsModel,
                    as: 'Envs',
                    attributes: [],
                },
                {
                    model: this.#ThemesModel,
                    as: 'Themes',
                    attributes: [],
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

    getTypes = async (typeLists) => {
        return await this.#TypesModel.findAll({
            where: {
                typeLists: { [Op.like]: '%' + typeLists + '%' },
            },
        });
    };

    getCampAmenities = async (typeLists) => {
        return await this.#CampAmenitiesModel.findAll({
            where: {
                campAmenities: { [Op.like]: '%' + typeLists + '%' },
            },
        });
    };

    getEnvs = async (typeLists) => {
        return await this.#EnvsModel.findAll({
            where: {
                envLists: { [Op.like]: '%' + typeLists + '%' },
            },
        });
    };

    getThemes = async (typeLists) => {
        return await this.#ThemesModel.findAll({
            where: {
                themeLists: { [Op.like]: '%' + typeLists + '%' },
            },
        });
    };
}

module.exports = SearchRepository;
