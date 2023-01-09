const BooksRepository = require('../repositories/books.repository.js');
const CampsRepository = require('../repositories/camps.repository.js');
const {
    ValidationError,
    InvalidParamsError,
} = require('../../middlewares/exceptions/error.class.js');

const { Books, Camps, Hosts, Users, Sites } = require('../../models');

class BooksService {
    constructor() {
        this.booksRepository = new BooksRepository(
            Books,
            Camps,
            Hosts,
            Users,
            Sites
        );
        this.campsRepository = new CampsRepository(
            Books,
            Camps,
            Hosts,
            Users,
            Sites
        );
    }

    // 캠핑장 예약하기
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

    //호스트 예약 리스트 조회
    getBookListByHost = async (hostId) => {
        return await this.booksRepository.findBookListByPk({
            where: { hostId },
        });
    };

    //호스트 예약 상세 조회
    getBookByHost = async (hostId, bookId) => {
        const book = await this.booksRepository.findBookByPk({
            where: { bookId },
        });

        if (book.hostId !== hostId) {
            throw new InvalidParamsError();
        }

        return book;
    };

    //유저 예약 리스트 조회
    getBookListByUser = async (userId) => {
        return await this.booksRepository.findBookListByPk({
            where: { userId },
        });
    };

    //유저 예약 상세 조회
    getBookByUser = async (userId, bookId) => {
        const book = await this.booksRepository.findBookByPk({
            where: { bookId },
        });

        if (book.userId !== userId) {
            throw new InvalidParamsError();
        }

        return book;
    };
}

module.exports = BooksService;
