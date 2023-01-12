const BooksRepository = require('../repositories/books.repository.js');
const CampsRepository = require('../repositories/camps.repository.js');
const SitesRepository = require('../repositories/sites.repository.js');
const {
    ValidationError,
    InvalidParamsError,
} = require('../../middlewares/exceptions/error.class.js');

const { Books, Camps, Hosts, Users, Sites } = require('../../models');
const { Op } = require('sequelize');
const { check } = require('prettier');

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
        this.sitesRepository = new SitesRepository(
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

        const checkCampBySiteId = await this.sitesRepository.findSiteById(
            campId,
            siteId
        );
        if (!checkCampBySiteId) {
            throw new ValidationError('예약할 수 없는 사이트입니다.', 400);
        }

        const totalPeople = Number(adults) + Number(children);

        return await this.booksRepository.addBookscamps(
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
                Camp_checkIn: bookList['Camp.checkIn'],
                Camp_checkOut: bookList['Camp.checkOut'],
                adults: bookList.adults,
                children: bookList.children,
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

    // 호스트 예약 확정/확정 취소
    confirmByHost = async (hostId, bookId) => {
        const book = await this.booksRepository.findBookByPk({
            where: {
                [Op.and]: [{ hostId, bookId }],
            },
        });

        let confirmBook = book.confirmBook;
        let message = '';
        if (book.confirmBook === false) {
            confirmBook = true;
            message = '예약확정 성공!';
        } else {
            confirmBook = false;
            message = '예약확정 취소!';
        }

        await this.booksRepository.updateBookConfirmBook(bookId, confirmBook);

        return message;
    };

    // 유저 예약 취소
    cancelBookByUser = async (userId, bookId) => {
        const book = await this.booksRepository.findBookByPk({
            where: {
                [Op.and]: [{ userId, bookId }],
            },
        });

        const hostPhoneNumber = book.Host.phoneNumber;

        let message = '';
        let cancelBooks = book.cancelBooks;
        if (book.confirmBook === true) {
            cancelBooks = false;
            message = '예약 취소 할 수 없습니다. 호스트에게 문의하세요.';
        } else {
            cancelBooks = true;
            message = '예약을 취소하였습니다';
        }

        await this.booksRepository.updateBookCancelBook(bookId, cancelBooks);

        return { message, hostPhoneNumber };
    };
}

module.exports = BooksService;
