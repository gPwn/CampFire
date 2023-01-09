const { Likes, Users, Camps } = require('../../models');

class LikesRepository {
    constructor() {}

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
