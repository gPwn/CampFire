const UsersRepository = require('../repositories/users.repository');
const { Users } = require('../../models');
require('dotenv').config();
const hash = require('../../util/auth-encryption.util');
const { createToken } = require('../../util/auth-jwtToken.util.js');

class UsersService {
    usersRepository = new UsersRepository(Users);

    //회원가입 API
    signUp = async (email, userName, password, phoneNumber, profileImg) => {
        const hashValue = hash(password);
        const user = await this.usersRepository.createUser(
            email,
            userName,
            hashValue,
            phoneNumber,
            profileImg
        );
        return user;
    };
}

module.exports = UsersService;
