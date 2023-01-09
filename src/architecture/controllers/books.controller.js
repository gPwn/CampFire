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

    getBooksByHost = async (req, res, next) => {
        try {
            const { hostId } = res.locals;

            const books = await this.booksService.getBooksByHost(hostId);

            res.status(200).json({ books: books });
        } catch (error) {
            next(error);
        }
    };

    getBooksByHUser = async (req, res, next) => {
        try {
            const { userId } = res.locals;

            const books = await this.booksService.getBooksByUser(userId);

            res.status(200).json({ books: books });
        } catch (error) {
            next(error);
        }
    };
}

module.exports = BooksController;
