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

    getCampLists = async (search, types, themes, envs, amenities) => {
        console.log(search, types, themes, envs, amenities);
        return await this.#CampsModel.findAll({
            // raw: true,
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
                    where: { envLists: { [Op.like]: '%' + envs + '%' } },
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

    getTypes = async (hash) => {
        return await this.#TypesModel.findAll({
            where: {
                campAmenities: { [Op.like]: '%' + hash + '%' },
            },
        });
    };

    getCampAmenities = async (hash) => {
        return await this.#CampAmenitiesModel.findAll({
            where: {
                campAmenities: { [Op.like]: '%' + hash + '%' },
            },
        });
    };

    getEnvs = async (hash) => {
        return await this.#EnvsModel.findAll({
            where: {
                envLists: { [Op.like]: '%' + hash + '%' },
            },
        });
    };

    getThemes = async (hash) => {
        return await this.#ThemesModel.findAll({
            where: {
                themeLists: { [Op.like]: '%' + hash + '%' },
            },
        });
    };
}

module.exports = SearchRepository;
