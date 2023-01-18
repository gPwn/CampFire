const { Op } = require('sequelize');

class SitesRepository {
    #BooksModel;
    #CampsModel;
    #HostsModel;
    #UsersModel;
    #SitesModel;
    #CampAmenitiesModel;
    #EnvsModel;
    #TypesModel;
    #ThemesModel;
    constructor(
        BooksModel,
        CampsModel,
        HostsModel,
        UsersModel,
        SitesModel,
        CampAmenitiesModel,
        EnvsModel,
        TypesModel,
        ThemesModel
    ) {
        this.#BooksModel = BooksModel;
        this.#CampsModel = CampsModel;
        this.#HostsModel = HostsModel;
        this.#UsersModel = UsersModel;
        this.#SitesModel = SitesModel;
        this.#CampAmenitiesModel = CampAmenitiesModel;
        this.#EnvsModel = EnvsModel;
        this.#TypesModel = TypesModel;
        this.#ThemesModel = ThemesModel;
    }

    // 캠핑장 사이트 등록
    createSite = async (
        hostId,
        campId,
        siteMainImage,
        siteSubImages,
        siteName,
        siteInfo,
        siteDesc,
        sitePrice,
        minPeople,
        maxPeople
    ) => {
        const createdSite = await this.#SitesModel.create({
            hostId,
            campId,
            siteMainImage,
            siteSubImages,
            siteName,
            siteInfo,
            siteDesc,
            sitePrice,
            minPeople,
            maxPeople,
        });
        return createdSite;
    };
    // 캠핑장 사이트 수정
    updateSite = async (
        hostId,
        campId,
        siteId,
        siteMainImage,
        siteSubImages,
        siteName,
        siteInfo,
        siteDesc,
        sitePrice,
        minPeople,
        maxPeople
    ) => {
        return await this.#SitesModel.update(
            {
                siteId,
                hostId,
                campId,
                siteMainImage,
                siteSubImages,
                siteName,
                siteInfo,
                siteDesc,
                sitePrice,
                minPeople,
                maxPeople,
            },
            {
                where: {
                    [Op.and]: [{ campId, hostId, siteId }],
                },
            }
        );
    };
    // 캠핑장 사이트 중복값 조회
    getIsExistValue = async (siteName) => {
        const site = await this.#SitesModel.findOne({
            where: { siteName },
        });
        return site;
    };
    // 캠핑장 사이트 조회
    findSiteById = async (campId, siteId) => {
        const site = await this.#SitesModel.findOne({
            where: { [Op.and]: [{ campId, siteId }] },
        });
        return site;
    };
    // 캠핑장 사이트 삭제
    deleteSite = async (campId, siteId, hostId) => {
        await this.#SitesModel.destroy({
            where: {
                [Op.and]: [{ campId, siteId, hostId }],
            },
        });
    };
}

module.exports = SitesRepository;
