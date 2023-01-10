const SitesService = require('../services/sites.service.js');
const {
    InvalidParamsError,
} = require('../../middlewares/exceptions/error.class');

class SitesController {
    constructor() {
        this.sitesService = new SitesService();
    }
    // 캠핑장 사이트 등록
    createSite = async (req, res, next) => {
        try {
            const { campId } = req.params;
            const { hostId } = res.locals;
            const {
                siteName,
                siteInfo,
                siteDesc,
                sitePrice,
                minPeople,
                maxPeople,
            } = req.body;
            let siteMainImage;
            const siteSubImagesArray = [];
            if (req.files) {
                siteMainImage = req.files.siteMainImage[0].location;
                for (const img of req.files.siteSubImages) {
                    siteSubImagesArray.push(img.location);
                }
            } else {
                throw new InvalidParamsError();
            }
            const siteSubImages = siteSubImagesArray.toString();
            if (
                !siteName ||
                !siteInfo ||
                !siteDesc ||
                !sitePrice ||
                !minPeople ||
                !maxPeople
            ) {
                throw new InvalidParamsError();
            }
            const { siteId } = await this.sitesService.createSite(
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
            res.status(201).json({
                message: '캠핑장 사이트가 등록되었습니다.',
                siteId: siteId,
            });
        } catch (error) {
            next(error);
        }
    };

    // 캠핑장 사이트 수정
    updateSite = async (req, res, next) => {
        try {
            const { campId, siteId } = req.params;
            const { hostId } = res.locals;
            const {
                siteName,
                siteInfo,
                siteDesc,
                sitePrice,
                minPeople,
                maxPeople,
            } = req.body;

            let siteMainImage;
            const siteSubImagesArray = [];

            if (req.files) {
                siteMainImage = req.files.siteMainImage[0].location;
                for (const img of req.files.siteSubImages) {
                    siteSubImagesArray.push(img.location);
                }
            } else {
                throw new InvalidParamsError();
            }
            const siteSubImages = siteSubImagesArray.toString();

            await this.sitesService.updateSite(
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
            res.status(201).json({
                message: '캠핑장 사이트가 수정되었습니다.',
            });
        } catch (error) {
            next(error);
        }
    };

    // 캠핑장 사이트 삭제
    deleteSite = async (req, res, next) => {
        try {
            const { campId, siteId } = req.params;
            const { hostId } = res.locals;

            await this.sitesService.deleteSite(campId, siteId, hostId);

            res.status(201).json({
                message: '캠핑장 사이트가 삭제되었습니다.',
            });
        } catch (error) {
            next(error);
        }
    };
}

module.exports = SitesController;
