const { Op } = require('sequelize');
const { sequelize, Sites, Camps, Hosts } = require('../../models');

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
        return await this.#BooksModel.create({
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
                {
                    model: Hosts,
                    attribute: [],
                },
            ],
        });
    };

    // 호스트 예약 확정/확정 취소
    updateBookConfirmBook = async (bookId, confirmBook) => {
        return await this.#BooksModel.update(
            { confirmBook },
            {
                where: { bookId },
            }
        );
    };

    // 유저 예약 취소
    updateBookCancelBook = async (bookId, cancelBooks) => {
        return await this.#BooksModel.update(
            { cancelBooks },
            {
                where: { bookId },
            }
        );
    };
}

module.exports = BooksRepository;
