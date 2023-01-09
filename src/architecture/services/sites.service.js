const SitesRepository = require('../repositories/sites.repository.js');
const {
    ValidationError,
    InvalidParamsError,
    ExistError,
} = require('../../middlewares/exceptions/error.class.js');

const {
    Books,
    Camps,
    Hosts,
    Users,
    Sites,
    CampAmenities,
    Envs,
    Types,
    Themes,
} = require('../../models');
const { deleteImage } = require('../../modules/campImg');
const {
    getMainImageName,
    getSubImagesNames,
} = require('../../modules/modules.js');

class SitesService {
    constructor() {
        this.sitesRepository = new SitesRepository(
            Books,
            Camps,
            Hosts,
            Users,
            Sites,
            CampAmenities,
            Envs,
            Types,
            Themes
        );
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
        const isExistValue = await this.sitesRepository.getIsExistValue(
            siteName
        );
        if (isExistValue) {
            throw new ExistError();
        }
        const createdSite = await this.sitesRepository.createSite(
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
        );
        if (!createdSite) {
            throw new ValidationError(
                '캠핑장 사이트 등록에 실패하였습니다.',
                400
            );
        }
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
        const findSite = await this.sitesRepository.findSiteById(
            campId,
            siteId
        );
        if (!findSite) {
            throw new InvalidParamsError(
                '캠핑장 사이트를 찾을 수 없습니다',
                404
            );
        }

        if (findSite.hostId !== hostId) {
            throw new ValidationError(
                '캠핑장 사이트 수정 권한이 없습니다.',
                400
            );
        }

        const siteMainImageName = getMainImageName(findSite['siteMainImage']);
        const siteSubImageNames = getSubImagesNames(findSite['siteSubImages']);

        await deleteImage(siteMainImageName);
        for (let siteSubImageName of siteSubImageNames) {
            await deleteImage(siteSubImageName);
        }

        return await this.sitesRepository.updateSite(
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
        );
    };

    // 캠핑장 사이트 삭제
    deleteSite = async (campId, siteId, hostId) => {
        const findSite = await this.sitesRepository.findSiteById(
            campId,
            siteId
        );
        if (!findSite) {
            throw new InvalidParamsError(
                '캠핑장 사이트를 찾을 수 없습니다',
                404
            );
        }

        if (findSite.hostId !== hostId) {
            throw new ValidationError('캠핑장 삭제 권한이 없습니다.', 400);
        }
        const siteMainImageName = getMainImageName(findSite['siteMainImage']);
        const siteSubImageNames = getSubImagesNames(findSite['siteSubImages']);

        await deleteImage(siteMainImageName);
        for (let siteSubImageName of siteSubImageNames) {
            await deleteImage(siteSubImageName);
        }

        await this.sitesRepository.deleteSite(campId, siteId, hostId);
    };
}

module.exports = SitesService;
