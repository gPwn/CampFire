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
                    where: getTypesIncludecondition(types),
                    model: this.#TypesModel,
                    as: 'Types',
                    attributes: ['typeLists'],
                },
                {
                    where: getCampAmenitiesIncludecondition(amenities),
                    model: this.#CampAmenitiesModel,
                    as: 'CampAmenities',
                    attributes: ['campAmenities'],
                },
                {
                    where: getEnvsIncludecondition(envs),
                    model: this.#EnvsModel,
                    as: 'Envs',
                    attributes: ['envLists'],
                },
                {
                    where: getThemesIncludecondition(themes),
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
function getTypesIncludecondition(Array) {
    if (Array.length === 0) {
        return null;
    } else if (Array.length === 1) {
        return { typeLists: { [Op.like]: '%' + Array + '%' } };
    } else if (Array.length === 2) {
        return {
            [Op.and]: [
                { typeLists: { [Op.like]: '%' + Array[0] + '%' } },
                { typeLists: { [Op.like]: '%' + Array[1] + '%' } },
            ],
        };
    } else if (Array.length === 3) {
        return {
            [Op.and]: [
                { typeLists: { [Op.like]: '%' + Array[0] + '%' } },
                { typeLists: { [Op.like]: '%' + Array[1] + '%' } },
                { typeLists: { [Op.like]: '%' + Array[2] + '%' } },
            ],
        };
    }
}
function getCampAmenitiesIncludecondition(Array) {
    if (Array.length === 0) {
        return null;
    } else if (Array.length === 1) {
        return { campAmenities: { [Op.like]: '%' + Array + '%' } };
    } else if (Array.length === 2) {
        return {
            [Op.and]: [
                { campAmenities: { [Op.like]: '%' + Array[0] + '%' } },
                { campAmenities: { [Op.like]: '%' + Array[1] + '%' } },
            ],
        };
    } else if (Array.length === 3) {
        return {
            [Op.and]: [
                { campAmenities: { [Op.like]: '%' + Array[0] + '%' } },
                { campAmenities: { [Op.like]: '%' + Array[1] + '%' } },
                { campAmenities: { [Op.like]: '%' + Array[2] + '%' } },
            ],
        };
    }
}
function getEnvsIncludecondition(Array) {
    if (Array.length === 0) {
        return null;
    } else if (Array.length === 1) {
        return { envLists: { [Op.like]: '%' + Array + '%' } };
    } else if (Array.length === 2) {
        return {
            [Op.and]: [
                { envLists: { [Op.like]: '%' + Array[0] + '%' } },
                { envLists: { [Op.like]: '%' + Array[1] + '%' } },
            ],
        };
    } else if (Array.length === 3) {
        return {
            [Op.and]: [
                { envLists: { [Op.like]: '%' + Array[0] + '%' } },
                { envLists: { [Op.like]: '%' + Array[1] + '%' } },
                { envLists: { [Op.like]: '%' + Array[2] + '%' } },
            ],
        };
    }
}
function getThemesIncludecondition(Array) {
    if (Array.length === 0) {
        return null;
    } else if (Array.length === 1) {
        return { themeLists: { [Op.like]: '%' + Array + '%' } };
    } else if (Array.length === 2) {
        return {
            [Op.and]: [
                { themeLists: { [Op.like]: '%' + Array[0] + '%' } },
                { themeLists: { [Op.like]: '%' + Array[1] + '%' } },
            ],
        };
    } else if (Array.length === 3) {
        return {
            [Op.and]: [
                { themeLists: { [Op.like]: '%' + Array[0] + '%' } },
                { themeLists: { [Op.like]: '%' + Array[1] + '%' } },
                { themeLists: { [Op.like]: '%' + Array[2] + '%' } },
            ],
        };
    }
}

module.exports = SearchRepository;
