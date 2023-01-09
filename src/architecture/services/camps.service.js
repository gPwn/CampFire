const CampsRepository = require('../repositories/camps.repository.js');
const {
    ValidationError,
    InvalidParamsError,
    ExistError,
} = require('../../middlewares/exceptions/error.class.js');

const { Books, Camps, Hosts, Users } = require('../../models');
const { deleteImage } = require('../../modules/campImg');
const {
    getMainImageName,
    getSubImagesNames,
} = require('../../modules/modules.js');

class CampsService {
    constructor() {
        this.campsRepository = new CampsRepository(Books, Camps, Hosts, Users);
    }

    // 캠핑장 페이지 조회
    getCampsByPage = async (pageNo) => {
        let start = 0;
        if (pageNo <= 0) {
            pageNo = 1;
        } else {
            start = (pageNo - 1) * 16;
        }

        const camps = await this.campsRepository.getCampsByPage(start);
        if (!camps) {
            throw new InvalidParamsError('존재하지 않는 페이지입니다.', 404);
        }

        return camps;
    };

    // 캠핑장 상세 조회
    findCampById = async (campId) => {
        const camp = await this.campsRepository.findCampById(campId);
        if (!camp) {
            throw new InvalidParamsError('존재하지 않는 캠핑장입니다.', 404);
        }

        const { campAmenities } = await this.campsRepository.findAmenities(
            campId
        );
        const { envLists } = await this.campsRepository.findEnvLists(campId);
        const { typeLists } = await this.campsRepository.findtypeList(campId);
        const { themeLists } = await this.campsRepository.findThemeLists(
            campId
        );

        return {
            campId: camp.campId,
            hostId: camp.hostId,
            campName: camp.campName,
            campAddress: camp.campAddress,
            campMainImage: camp.campMainImage,
            campSubImages: camp.campSubImages.split(','),
            campDesc: camp.campDesc,
            campAmenities,
            envLists,
            typeLists,
            themeLists,
            checkIn: camp.checkIn,
            checkOut: camp.checkOut,
            createdAt: camp.createdAt,
            updatedAt: camp.updatedAt,
        };
    };

    //캠핑장 사이트 목록 조회
    getSiteLists = async (campId) => {
        const camp = await this.campsRepository.findCampById(campId);
        if (!camp) {
            throw new InvalidParamsError('존재하지 않는 캠핑장입니다.', 404);
        }

        return await this.campsRepository.getSiteLists(campId);
    };

    //캠핑장 사이트 상세 조회
    getsiteById = async (campId, siteId) => {
        const camp = await this.campsRepository.findCampById(campId);
        if (!camp) {
            throw new InvalidParamsError('존재하지 않는 캠핑장입니다.', 404);
        }

        const site = await this.campsRepository.getsiteById(campId, siteId);
        if (!site) {
            throw new InvalidParamsError(
                '존재하지 않는 캠핑장 사이트입니다.',
                404
            );
        }

        return site;
    };
}

module.exports = CampsService;
