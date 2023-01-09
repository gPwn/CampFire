const CampsService = require('../services/camps.service.js');
const {
    InvalidParamsError,
} = require('../../middlewares/exceptions/error.class');

class CampsController {
    constructor() {
        this.campsService = new CampsService();
    }
    // 캠핑장 페이지 조회
    getCampsByPage = async (req, res, next) => {
        try {
            const pageInfo = req.query;
            const pageNo = pageInfo.pageno;
            if (!pageInfo) {
                throw new InvalidParamsError();
            }
            const camps = await this.campsService.getCampsByPage(pageNo);
            res.status(200).json({ camps: camps });
        } catch (error) {
            next(error);
        }
    };

    // 캠핑장 상세 조회
    getCampById = async (req, res, next) => {
        try {
            const { campId } = req.params;

            const camp = await this.campsService.findCampById(campId);

            res.status(200).json({ camp: camp });
        } catch (error) {
            next(error);
        }
    };

    //캠핑장 사이트 목록 조회
    getSiteLists = async (req, res, next) => {
        try {
            const { campId } = req.params;

            const sites = await this.campsService.getSiteLists(campId);

            res.status(200).json({ sites });
        } catch (error) {
            next(error);
        }
    };

    //캠핑장 사이트 상세 조회
    getsiteById = async (req, res, next) => {
        try {
            const { campId } = req.params;
            const { siteId } = req.params;

            const site = await this.campsService.getsiteById(campId, siteId);

            res.status(200).json({ site });
        } catch (error) {
            next(error);
        }
    };
}

module.exports = CampsController;
