const BooksService = require('../services/books.service.js');

class BooksController {
    constructor() {
        this.booksService = new BooksService();
    }

    // 캠핑장 예약하기
    addBookscamps = async (req, res, next) => {
        try {
            const { campId } = req.params;
            const { siteId } = req.params;
            const { userId } = res.locals;

            const { checkInDate, checkOutDate, adults, children } = req.body;

            await this.booksService.addBookscamps(
                campId,
                userId,
                siteId,
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

    //호스트 예약 리스트 조회
    getBookListByHost = async (req, res, next) => {
        try {
            const { hostId } = res.locals;

            const books = await this.booksService.getBookListByHost(hostId);

            res.status(200).json({ books });
        } catch (error) {
            next(error);
        }
    };

    //호스트 예약 상세 내역 조회
    getBookByHost = async (req, res, next) => {
        try {
            const { hostId } = res.locals;
            const { bookId } = req.params;

            const book = await this.booksService.getBookByHost(hostId, bookId);

            res.status(200).json({ book });
        } catch (error) {
            next(error);
        }
    };

    //유저 예약 리스트 조회
    getBookListByUser = async (req, res, next) => {
        try {
            const { userId } = res.locals;

            const books = await this.booksService.getBookListByUser(userId);

            res.status(200).json({ books });
        } catch (error) {
            next(error);
        }
    };

    //유저 예약 상세 내역 조회
    getBookByUser = async (req, res, next) => {
        try {
            const { userId } = res.locals;
            const { bookId } = req.params;

            const book = await this.booksService.getBookByUser(userId, bookId);

            res.status(200).json({ book });
        } catch (error) {
            next(error);
        }
    };
}

module.exports = BooksController;
