const LikesService = require('../services/likes.service.js');

class LikesController {
    constructor() {
        this.likesService = new LikesService();
    }

    addLike = async (req, res, next) => {
        try {
            console.log('라이크 컨트롤러');
            const { campId } = req.params;
            // const { userId } = res.locals;
            const userId = 2;

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
}

module.exports = LikesController;
