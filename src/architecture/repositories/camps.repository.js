const { Op } = require('sequelize');

class CampsRepository {
    #BooksModel;
    #CampsModel;
    #HostsModel;
    #UsersModel;
    constructor(BooksModel, CampsModel, HostsModel, UsersModel) {
        this.#BooksModel = BooksModel;
        this.#CampsModel = CampsModel;
        this.#HostsModel = HostsModel;
        this.#UsersModel = UsersModel;
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
        const createdCamp = await this.#CampsModel.create({
            hostId,
            campMainImage,
            campSubImages,
            campName,
            campAddress,
            campPrice,
            campDesc,
            campAmenities,
            checkIn,
            checkOut,
        });
        return createdCamp;
    };

    // 캠핑장 페이지 조회
    getCampsByPage = async (pageNo) => {
        const camps = await this.#CampsModel.findAll({
            offset: pageNo,
            limit: 8,
            order: [['createdAt', 'DESC']],
        });
        if (camps.length === 0) {
            return false;
        } else {
            return camps;
        }
    };

    // 캠핑장 상세 조회
    findCampById = async (campId) => {
        const camp = await this.#CampsModel.findOne({
            where: { campId },
        });
        return camp;
    };

    // 캠핑장 예약하기
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
        return await this.#CampsModel.update(
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
        await this.#CampsModel.destroy({
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
        await this.#BooksModel.create({
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
