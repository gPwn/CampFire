const CampsService = require('../services/camps.service.js');
const {
    InvalidParamsError,
} = require('../../middlewares/exceptions/error.class');

class CampsController {
    constructor() {
        this.campsService = new CampsService();
    }
    // 캠핑장 업로드
    createCamp = async (req, res, next) => {
        try {
            const {
                campName,
                campAddress,
                campPrice,
                campDesc,
                checkIn,
                checkOut,
            } = req.body;

            const { hostId } = res.locals;
            let campMainImage;
            const campSubImagesArray = [];
            if (req.files) {
                campMainImage = req.files.campMainImage[0].location;
                for (const img of req.files.campSubImages) {
                    campSubImagesArray.push(img.location);
                }
            } else {
                throw new InvalidParamsError();
            }
            const campAmenitiesArray = req.body.campAmenities;
            const campAmenities = campAmenitiesArray.toString();
            const campSubImages = campSubImagesArray.toString();
            if (
                !campName ||
                !campAddress ||
                !campPrice ||
                !campDesc ||
                !campAmenities ||
                !checkIn ||
                !checkOut
            ) {
                throw new InvalidParamsError();
            }
            const { campId } = await this.campsService.createCamp(
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
            res.status(201).json({
                message: '캠핑장이 등록되었습니다.',
                campId: campId,
            });
        } catch (error) {
            next(error);
        }
    };
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
    // 캠핑장 수정
    updateCamps = async (req, res, next) => {
        try {
            const {
                campName,
                campAddress,
                campPrice,
                campDesc,
                checkIn,
                checkOut,
            } = req.body;

            const { hostId } = res.locals;
            const { campId } = req.params;

            let campMainImage;
            const campSubImagesArray = [];

            if (req.files) {
                campMainImage = req.files.campMainImage[0].location;
                for (const img of req.files.campSubImages) {
                    campSubImagesArray.push(img.location);
                }
            } else {
                throw new InvalidParamsError();
            }
            const campAmenitiesArray = req.body.campAmenities;
            const campAmenities = campAmenitiesArray.toString();
            const campSubImages = campSubImagesArray.toString();

            await this.campsService.updateCamps(
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

            console.log(campSubImages);
            res.status(201).json({
                message: '캠핑장이 수정되었습니다.',
                campId: campId,
            });
        } catch (error) {
            next(error);
        }
    };

    // 캠핑장 삭제
    deletecamps = async (req, res, next) => {
        try {
            const { campId } = req.params;
            const { hostId } = res.locals;

            await this.campsService.deletecamps(campId, hostId);

            res.status(201).json({
                message: '캠핑장이 삭제되었습니다.',
            });
        } catch (error) {
            next(error);
        }
    };

    // 캠핑장 예약하기
    addBookscamps = async (req, res, next) => {
        try {
            const { campId } = req.params;
            const { userId } = res.locals;

            const { checkInDate, checkOutDate, adults, children } = req.body;

            await this.campsService.addBookscamps(
                campId,
                userId,
                checkInDate,
                checkOutDate,
                adults,
                children
            );

            res.status(201).json({
                message: '캠핑장이 예약되었습니다.',
            });
        } catch (error) {
            next(error);
        }
    };
}

module.exports = CampsController;
