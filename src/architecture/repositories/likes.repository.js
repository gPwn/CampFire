const { Likes, Users, Camps } = require('../../models');
const { Op } = require('sequelize');

class LikesRepository {
    constructor() {}

    findLike = async (campId, userId) => {
        return await Likes.findOne({
            where: {
                [Op.and]: [{ campId, userId }],
            },
        });
    };

    addLike = async (campId, userId) => {
        return await Likes.create({
            campId,
            userId,
        });
    };

    userLikeupdate = async (userId, userlike) => {
        await Users.update(
            {
                likes: userlike,
            },
            { where: { userId } }
        );
    };

    campLikeupdate = async (campId, camplike) => {
        await Camps.update(
            {
                likes: camplike,
            },
            { where: { campId } }
        );
    };
}

module.exports = LikesRepository;
