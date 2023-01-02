const CampsService = require('../services/camps.service.js');

class CampsController {
    constructor() {
        this.campsService = new CampsService();
    }

    updateCamps = async (req, res, next) => {
        try {
            const {
                campName,
                campAddress,
                campPrice,
                campDesc,
                campAmenities,
                checkIn,
                checkOut,
            } = req.body;

            const { campId } = req.params;
            const { hostId } = res.locals;

            const campMainImage = req.files.campMainImage[0].location;
            const campSubImagesObjects = req.files.campSubImages;

            let campSubImages = '';
            if (campSubImagesObjects) {
                for (let i = 0; i < campSubImagesObjects.length; i++) {
                    campSubImages += campSubImagesObjects[i].location;
                    campSubImages += ',';
                }
            }

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

            res.status(201).json({
                message: '캠핑장이 수정되었습니다.',
            });
        } catch (error) {
            next(error);
        }
    };

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
