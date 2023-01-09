const { Op } = require('sequelize');
const {
    sequelize,
    CampAmenities,
    Envs,
    Themes,
    Types,
    Sites,
} = require('../../models');

class CampsRepository {
    #BooksModel;
    #CampsModel;
    #HostsModel;
    #UsersModel;
    constructor(BooksModel, CampsModel, HostsModel, UsersModel) {
        this.#BooksModel = BooksModel;
        this.#CampsModel = CampsModel;
        this.#HostsModel = HostsModel;
        this.#UsersModel = UsersModel;
    }

    // 캠핑장 페이지 조회
    getCampsByPage = async (pageNo) => {
        const camps = await this.#CampsModel.findAll({
            offset: pageNo,
            limit: 16,
            attributes: [
                'campId',
                'hostId',
                'campName',
                'campAddress',
                'campMainImage',
                'campDesc',
                'checkIn',
                'checkOut',
                'createdAt',
                'updatedAt',
            ],
            order: [['createdAt', 'DESC']],
        });
        if (camps.length === 0) {
            return false;
        } else {
            return camps;
        }
    };

    // 캠핑장 상세 조회
    findCampById = async (campId) => {
        return await this.#CampsModel.findOne({
            where: { campId },
        });
    };

    findAmenities = async (campId) => {
        return await CampAmenities.findOne({
            where: { campId },
        });
    };

    findEnvLists = async (campId) => {
        return await Envs.findOne({
            where: { campId },
        });
    };

    findtypeList = async (campId) => {
        return await Types.findOne({
            where: { campId },
        });
    };

    findThemeLists = async (campId) => {
        return await Themes.findOne({
            where: { campId },
        });
    };

    getSiteLists = async (campId) => {
        return await Sites.findAll({
            where: { campId },
            attributes: [
                'siteId',
                'campId',
                'siteName',
                'sitePrice',
                'siteMainImage',
                'minPeople',
                'maxPeople',
                'createdAt',
                'updatedAt',
            ],
            order: [['sitePrice', 'ASC']],
        });
    };

    getsiteById = async (campId, siteId) => {
        return await Sites.findOne({
            where: {
                [Op.and]: [{ campId, siteId }],
            },
        });
    };
}

module.exports = CampsRepository;
