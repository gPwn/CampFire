const { Op } = require('sequelize');
const { sequelize, Sites, Camps } = require('../../models');

class BooksRepository {
    #BooksModel;
    #SitesModel;
    constructor(BooksModel, SitesModel) {
        this.#BooksModel = BooksModel;
        this.#SitesModel = SitesModel;
    }

    // 캠핑장 예약하기
    addBookscamps = async (
        campId,
        userId,
        hostId,
        siteId,
        checkInDate,
        checkOutDate,
        adults,
        children,
        totalPeople
    ) => {
        await this.#BooksModel.create({
            campId,
            userId,
            hostId,
            siteId,
            checkInDate,
            checkOutDate,
            adults,
            children,
            totalPeople,
        });
    };

    //PK값과 일치하는 모든 데이터 찾기
    findBookListByPk = async ({ where }) => {
        return await this.#BooksModel.findAll({
            raw: true,
            where,
            include: [
                {
                    model: Sites,
                    attribute: [],
                },
                {
                    model: Camps,
                    attribute: [],
                },
            ],
        });
    };

    //PK값과 일치하는 하나의 데이터 찾기
    findBookByPk = async ({ where }) => {
        return await this.#BooksModel.findOne({
            where,
            include: [
                {
                    model: Sites,
                    attribute: [],
                },
            ],
        });
    };
}

module.exports = BooksRepository;
