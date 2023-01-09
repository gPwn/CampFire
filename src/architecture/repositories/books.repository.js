const { Op } = require('sequelize');
const { sequelize } = require('../../models');

class BooksRepository {
    #BooksModel;
    constructor(BooksModel) {
        this.#BooksModel = BooksModel;
    }

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

    findBooksByHostId = async (hostId) => {
        return await this.#BooksModel.findAll({
            where: { hostId },
        });
    };

    findBooksByUserId = async (userId) => {
        return await this.#BooksModel.findAll({
            where: { userId },
        });
    };
}

module.exports = BooksRepository;
