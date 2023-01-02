const { Op } = require('sequelize');
const { Camps, Books, sequelize } = require('../../models');

class CampsRepository {
    getHostIdCamps = async (campId) => {
        return await Camps.findOne({
            where: { campId },
        });
    };

    updateCamps = async (
        campId,
        hostId,
        campName,
        campAddress,
        campPrice,
        campMainImage,
        campSubImages,
        campDesc,
        campAmenity,
        checkIn,
        checkOut
    ) => {
        return await Camps.update(
            {
                campId,
                hostId,
                campName,
                campAddress,
                campPrice,
                campMainImage,
                campSubImages,
                campDesc,
                campAmenity,
                checkIn,
                checkOut,
            },
            {
                where: {
                    [Op.and]: [{ campId, hostId }],
                },
            }
        );
    };

    deletecamps = async (campId, hostId) => {
        await Camps.destroy({
            where: {
                [Op.and]: [{ campId, hostId }],
            },
        });
    };

    addBookscamps = async (
        campId,
        userId,
        hostId,
        checkInDate,
        checkOutDate,
        adults,
        children
    ) => {
        await Books.create({
            campId,
            userId,
            hostId,
            checkInDate,
            checkOutDate,
            adults,
            children,
        });
    };
}

module.exports = CampsRepository;
