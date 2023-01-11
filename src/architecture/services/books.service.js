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
        const bookLists = await this.booksRepository.findBookListByPk({
            where: { hostId },
        });

        return bookLists.map((bookList) => {
            return {
                bookId: bookList.bookId,
                userId: bookList.userId,
                hostId: bookList.hostId,
                campId: bookList.campId,
                siteId: bookList.siteId,
                siteName: bookList['Site.siteName'],
                siteDesc: bookList['Site.siteDesc'],
                siteInfo: bookList['Site.siteInfo'],
                sitePrice: bookList['Site.sitePrice'],
                siteMainImage: bookList['Site.siteMainImage'],
                checkInDate: bookList.checkInDate,
                checkOutDate: bookList.checkOutDate,
                adults: bookList.adults,
                children: bookList.children,
                totalPeople: bookList.totalPeople,
                createdAt: bookList.createdAt,
                updatedAt: bookList.updatedAt,
            };
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

        return {
            bookId: book.bookId,
            userId: book.userId,
            hostId: book.hostId,
            campId: book.campId,
            siteId: book.siteId,
            siteName: book.Site.siteName,
            siteDesc: book.Site.siteDesc,
            siteInfo: book.Site.siteInfo,
            sitePrice: book.Site.sitePrice,
            siteMainImage: book.Site.siteMainImage,
            checkInDate: book.checkInDate,
            checkOutDate: book.checkOutDate,
            adults: book.adults,
            children: book.children,
            totalPeople: book.totalPeople,
            createdAt: book.createdAt,
            updatedAt: book.updatedAt,
        };
    };

    //유저 예약 리스트 조회
    getBookListByUser = async (userId) => {
        const bookLists = await this.booksRepository.findBookListByPk({
            where: { userId },
        });

        return bookLists.map((bookList) => {
            return {
                bookId: bookList.bookId,
                userId: bookList.userId,
                hostId: bookList.hostId,
                campId: bookList.campId,
                siteId: bookList.siteId,
                siteName: bookList['Site.siteName'],
                siteDesc: bookList['Site.siteDesc'],
                siteInfo: bookList['Site.siteInfo'],
                sitePrice: bookList['Site.sitePrice'],
                siteMainImage: bookList['Site.siteMainImage'],
                checkInDate: bookList.checkInDate,
                checkOutDate: bookList.checkOutDate,
                Camp_checkIn: bookList['Camp.checkIn'],
                Camp_checkOut: bookList['Camp.checkOut'],
                adults: bookList.adults,
                children: bookList.children,
                createdAt: bookList.createdAt,
                updatedAt: bookList.updatedAt,
            };
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

        return {
            bookId: book.bookId,
            userId: book.userId,
            hostId: book.hostId,
            campId: book.campId,
            siteId: book.siteId,
            siteName: book.Site.siteName,
            siteDesc: book.Site.siteDesc,
            siteInfo: book.Site.siteInfo,
            sitePrice: book.Site.sitePrice,
            siteMainImage: book.Site.siteMainImage,
            checkInDate: book.checkInDate,
            checkOutDate: book.checkOutDate,
            adults: book.adults,
            children: book.children,
            totalPeople: book.totalPeople,
            createdAt: book.createdAt,
            updatedAt: book.updatedAt,
        };
    };
}

module.exports = BooksService;
