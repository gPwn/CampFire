const LikesService = require('../services/likes.service.js');

class LikesController {
    constructor() {
        this.likesService = new LikesService();
    }

    addLike = async (req, res, next) => {
        try {
            const { campId } = req.params;
            const { userId } = res.locals;

            await this.likesService.addLike(campId, userId);

            res.status(201).json({
                message: '캠핑장 찜하기를 성공하였습니다.',
                campId,
                userId,
            });
        } catch (error) {
            next(error);
        }
    };

    deleteLike = async (req, res, next) => {
        try {
            const { campId } = req.params;
            const { userId } = res.locals;

            await this.likesService.deleteLike(campId, userId);

            res.status(201).json({
                message: '캠핑장 찜하기를 취소하였습니다.',
                campId,
                userId,
            });
        } catch (error) {
            next(error);
        }
    };
}

module.exports = LikesController;
