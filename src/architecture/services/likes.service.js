const LikesRepository = require('../repositories/likes.repository.js');
const UsersRepository = require('../repositories/users.repository.js');
const CampsRepository = require('../repositories/camps.repository.js');
const {
    ValidationError,
    InvalidParamsError,
    ExistError,
} = require('../../middlewares/exceptions/error.class.js');
const {
    Books,
    Camps,
    Hosts,
    Users,
    Sites,
    CampAmenities,
    Envs,
    Types,
    Themes,
    Likes,
} = require('../../models');

class LikesService {
    constructor() {
        this.liksRepository = new LikesRepository();
    }
    usersRepository = new UsersRepository(Users);
    campsRepository = new CampsRepository(Books, Camps, Hosts, Users);

    addLike = async (campId, userId) => {
        const findUser = await this.usersRepository.findOneUser(userId);
        const findCamps = await this.campsRepository.findCampById(campId);

        if (!findCamps) {
            throw new InvalidParamsError('찜할 수 없는 캠핑장입니다.', 400);
        }

        const userlike = Number(findUser.likes) + Number(1);
        const camplike = Number(findCamps.likes) + Number(1);

        await this.liksRepository.userLikeupdate(userId, userlike);
        await this.liksRepository.campLikeupdate(campId, camplike);

        return await this.liksRepository.addLike(campId, userId);
    };

    deleteLike = async (campId, userId) => {
        const findUser = await this.usersRepository.findOneUser(userId);
        const findCamps = await this.campsRepository.findCampById(campId);

        const userlike = Number(findUser.likes) - Number(1);
        const camplike = Number(findCamps.likes) - Number(1);

        await this.liksRepository.userLikeupdate(userId, userlike);
        await this.liksRepository.campLikeupdate(campId, camplike);

        return await this.liksRepository.addLike(campId, userId);
    };
}

module.exports = LikesService;
