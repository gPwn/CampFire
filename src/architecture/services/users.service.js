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

    //아이디/닉네임 중복확인 API
    findDup = async (query) => {
        const prop = Object.keys(query)[0];
        const value = Object.values(query)[0];
        if (prop === 'email') {
            const user = await this.usersRepository.findOneUserByEmail(value);
            if (user) {
                throw '이미 사용중인 이메일입니다.';
            } else {
                return '이메일 중복확인에 성공하였습니다.';
            }
        } else if (prop === 'userName') {
            const user = await this.usersRepository.findOneUserByUserName(
                value
            );
            if (user) {
                throw '이미 사용중인 닉네임입니다.';
            } else {
                return '닉네임 중복확인에 성공하였습니다.';
            }
        } else {
            throw 'Service findDup Error';
        }
    };
}

module.exports = UsersService;
