const { Op } = require('sequelize');

class UsersRepository {
    #userModel;
    constructor(UserModel) {
        this.#userModel = UserModel;
    }

    createUser = async (email, userName, password, phoneNumber, profileImg) => {
        const createUser = await this.#userModel.create({
            email,
            userName,
            password,
            phoneNumber,
            profileImg,
        });
        return createUser;
    };

    findOneUserByEmail = async (email) => {
        return await this.#userModel.findOne({
            where: { email },
            attributes: { exclude: ['password'] },
        });
    };
    findOneUserByUserName = async (userName) => {
        return await this.#userModel.findOne({
            where: { userName },
            attributes: { exclude: ['password'] },
        });
    };
    findUserByAuth = async (email, password) => {
        const findUser = await this.#userModel.findOne({
            where: { [Op.and]: [{ email }, { password }] },
            attributes: { exclude: ['password'] },
        });
        return findUser;
    };

    updateRefreshToken = async (token, email) => {
        await this.#userModel.update({ token }, { where: { email: email } });
    };

    findOneUser = async (userId) => {
        return this.#userModel.findOne({
            where: { userId },
        });
    };
}

module.exports = UsersRepository;
