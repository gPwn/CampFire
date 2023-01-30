const { Op } = require('sequelize');
const { sequelize } = require('../../models');

class AuthsRepository {
    #userModel;
    constructor(UserModel) {
        this.#userModel = UserModel;
    }

    createUser = async (
        email,
        userName,
        password,
        phoneNumber,
        profileImg,
        provider
    ) => {
        const createUser = await this.#userModel.create({
            email,
            userName,
            password,
            phoneNumber,
            profileImg,
            provider,
        });
        return createUser;
    };

    findOneUserBySnsId = async (snsId) => {
        return await this.#userModel.findOne({
            where: { snsId },
            attributes: { exclude: ['password'] },
        });
    };

    updateRefreshToken = async (token, email) => {
        await this.#userModel.update({ token }, { where: { email: email } });
    };
}

module.exports = AuthsRepository;
