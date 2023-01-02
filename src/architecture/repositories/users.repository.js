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
}

module.exports = UsersRepository;
