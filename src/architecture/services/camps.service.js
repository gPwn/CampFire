const CampsRepository = require('../repositories/camps.repository.js');
const {
    ValidationError,
    InvalidParamsError,
    ExistError,
} = require('../../middlewares/exceptions/error.class.js');

const { Books, Camps, Hosts, Users } = require('../../models');

class CampsService {
    constructor() {
        this.campsRepository = new CampsRepository(Books, Camps, Hosts, Users);
    }

    // 캠핑장 업로드
    createCamp = async (
        hostId,
        campMainImage,
        campSubImages,
        campName,
        campAddress,
        campPrice,
        campDesc,
        campAmenities,
        checkIn,
        checkOut
    ) => {
        const isExistValue = await this.campsRepository.getIsExistValue(
            campName,
            campAddress
        );
        if (isExistValue) {
            throw new ExistError();
        }

        const createdCamp = await this.campsRepository.createCamp(
            hostId,
            campMainImage,
            campSubImages,
            campName,
            campAddress,
            campPrice,
            campDesc,
            campAmenities,
            checkIn,
            checkOut
        );
        if (!createdCamp) {
            throw new ValidationError('캠핑장 등록에 실패하였습니다.', 400);
        }
        return createdCamp;
    };

    // 캠핑장 페이지 조회
    getCampsByPage = async (pageNo) => {
        let start = 0;
        if (pageNo <= 0) {
            pageNo = 1;
        } else {
            start = (pageNo - 1) * 8;
        }

        const camps = await this.campsRepository.getCampsByPage(start);
        if (!camps) {
            throw new ValidationError('존재하지 않는 페이지입니다.', 404);
        }
        return camps.map((camp) => {
            return {
                campId: camp.campId,
                hostId: camp.hostId,
                campName: camp.campName,
                campAddress: camp.campAddress,
                campPrice: camp.campPrice,
                campMainImage: camp.campMainImage,
                campSubImages: camp.campSubImages.split(','),
                campDesc: camp.campDesc,
                campAmenities: camp.campAmenities.split(','),
                checkIn: camp.checkIn,
                checkOut: camp.checkOut,
                createdAt: camp.createdAt,
                updatedAt: camp.updatedAt,
            };
        });
    };

    // 캠핑장 상세 조회
    findCampById = async (campId) => {
        const camp = await this.campsRepository.findCampById(campId);
        if (!camp) {
            throw new ValidationError('존재하지 않는 캠핑장입니다.', 404);
        }
        return {
            campId: camp.campId,
            hostId: camp.hostId,
            campName: camp.campName,
            campAddress: camp.campAddress,
            campPrice: camp.campPrice,
            campMainImage: camp.campMainImage,
            campSubImages: camp.campSubImages.split(','),
            campDesc: camp.campDesc,
            campAmenities: camp.campAmenities.split(','),
            checkIn: camp.checkIn,
            checkOut: camp.checkOut,
            createdAt: camp.createdAt,
            updatedAt: camp.updatedAt,
        };
    };

    // 캠핑장 수정
    updateCamps = async (
        campId,
        hostId,
        campName,
        campAddress,
        campPrice,
        campMainImage,
        campSubImages,
        campDesc,
        campAmenities,
        checkIn,
        checkOut
    ) => {
        const findHostId = await this.campsRepository.findCampById(campId);
        if (!findHostId) {
            throw new InvalidParamsError();
        }

        if (findHostId.hostId !== hostId) {
            throw new ValidationError('캠핑장 수정 권한이 없습니다.', 400);
        }

        return await this.campsRepository.updateCamps(
            campId,
            hostId,
            campName,
            campAddress,
            campPrice,
            campMainImage,
            campSubImages,
            campDesc,
            campAmenities,
            checkIn,
            checkOut
        );
    };

    // 캠핑장 삭제
    deletecamps = async (campId, hostId) => {
        const findHostId = await this.campsRepository.findCampById(campId);
        if (!findHostId) {
            throw new InvalidParamsError();
        }

        if (findHostId.hostId !== hostId) {
            throw new ValidationError('캠핑장 삭제 권한이 없습니다.', 400);
        }

        await this.campsRepository.deletecamps(campId, hostId);
    };

    // 캠핑장 예약
    addBookscamps = async (
        campId,
        userId,
        checkInDate,
        checkOutDate,
        adults,
        children
    ) => {
        const findHostId = await this.campsRepository.findCampById(campId);
        if (!findHostId) {
            throw new ValidationError('예약할 수 없는 캠핑장입니다.', 400);
        }

        const hostId = findHostId.hostId;

        await this.campsRepository.addBookscamps(
            campId,
            userId,
            hostId,
            checkInDate,
            checkOutDate,
            adults,
            children
        );
    };
}

module.exports = CampsService;
