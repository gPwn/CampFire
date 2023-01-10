const LikesRepository = require('../repositories/likes.repository.js');
const UsersRepository = require('../repositories/users.repository.js');
const CampsRepository = require('../repositories/camps.repository.js');

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
    usersRepository = new UsersRepository(Users);
    campsRepository = new CampsRepository(Books, Camps, Hosts, Users);
    liksRepository = new UsersRepository(Users);

    addLike = async (campId, userId) => {
        console.log(campId, userId);
        const findUser = await this.usersRepository.findOneUser(userId);
        const findCamps = await this.campsRepository.findCampById(campId);

        console.log(findUser);
        console.log(findCamps);

        await this.LikesRepository;
    };
}

module.exports = LikesService;
