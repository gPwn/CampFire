const BooksRepository = require('../repositories/books.repository.js');
const CampsRepository = require('../repositories/camps.repository.js');
const {
    ValidationError,
} = require('../../middlewares/exceptions/error.class.js');

const { Books, Camps, Hosts, Users, Sites } = require('../../models');

class BooksService {
    constructor() {
        this.booksRepository = new BooksRepository(Books, Camps, Hosts, Users);
        this.campsRepository = new CampsRepository(
            Books,
            Camps,
            Hosts,
            Users,
            Sites
        );
    }

    // 캠핑장 예약
    addBookscamps = async (
        campId,
        userId,
        siteId,
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

        const totalPeople = Number(adults) + Number(children);

        await this.booksRepository.addBookscamps(
            campId,
            userId,
            hostId,
            siteId,
            checkInDate,
            checkOutDate,
            adults,
            children,
            totalPeople
        );
    };

    getBooksByHost = async (hostId) => {
        return await this.booksRepository.findBooksByHostId(hostId);
    };

    getBooksByUser = async (userId) => {
        return await this.booksRepository.findBooksByUserId(userId);
    };
}

module.exports = BooksService;
