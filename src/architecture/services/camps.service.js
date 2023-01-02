const CampsRepository = require('../repositories/camps.repository.js');
const {
    ValidationError,
    InvalidParamsError,
    ExistError,
} = require('../../middlewares/exceptions/error.class.js');

class CampsService {
    constructor() {
        this.campsRepository = new CampsRepository();
    }

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
        const findHostId = await this.campsRepository.getHostIdCamps(campId);
        if (!findHostId) {
            throw new InvalidParamsError();
        }

        if (findHostId.hostId !== hostId) {
            throw new ValidationError('캠핑장 수정 권한이 없습니다.', 400);
        }

        const isExistValue = await this.campsRepository.getIsExistValue(
            campName,
            campAddress
        );
        if (isExistValue) {
            throw new ExistError();
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

    deletecamps = async (campId, hostId) => {
        const findHostId = await this.campsRepository.getHostIdCamps(campId);
        if (!findHostId) {
            throw new InvalidParamsError();
        }

        if (findHostId.hostId !== hostId) {
            throw new ValidationError('캠핑장 삭제 권한이 없습니다.', 400);
        }

        await this.campsRepository.deletecamps(campId, hostId);
    };

    addBookscamps = async (
        campId,
        userId,
        checkInDate,
        checkOutDate,
        adults,
        children
    ) => {
        const findHostId = await this.campsRepository.getHostIdCamps(campId);
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
