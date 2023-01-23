const UsersRepository = require('../repositories/users.repository');
const AuthsRepository = require('../repositories/auths.repository.js');
const axios = require('axios');
const request = require('request');
const { Users } = require('../../models');
require('dotenv').config();
const hash = require('../../util/auth-encryption.util');
const { createUserToken } = require('../../util/auth-jwtToken.util.js');
const { ValidationError } = require('../../middlewares/exceptions/error.class');

class AuthsService {
    authsRepository = new AuthsRepository(Users);

    //회원가입 API
    signUp = async (email, userName, password, phoneNumber, profileImg) => {
        const hashValue = hash(password);
        const user = await this.authsRepository.createUser(
            email,
            userName,
            hashValue,
            phoneNumber,
            profileImg
        );
        return user;
    };

    loginKakao = async (code) => {
        const resultPost = await axios.post(
            'https://kauth.kakao.com/oauth/token',
            {},
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                params: {
                    grant_type: 'authorization_code',
                    client_id: process.env.KAKAO_CLIENT_ID,
                    code,
                    redirect_uri: process.env.KAKAO_REDIRECT_URL,
                },
            }
        );
        const data = resultPost.data['access_token'];

        const resultGet = await axios.get('https://kapi.kakao.com/v2/user/me', {
            headers: {
                Authorization: `Bearer ${data}`,
                'Content`Type': `application/x-www-form-urlencoded;charset=utf-8`,
            },
        });

        console.log('resultGet = ', resultGet);

        const email = resultGet.data.kakao_account['email'];
        const userName = resultGet.data.properties['nickname'];
        const profileImg = resultGet.data.properties['profile_image'];
        const phoneNumber = '';

        console.log('email = ', email);
        console.log('userName = ', userName);

        if (!email || !userName)
            throw new ValidationError(
                '카카오 인증 정보가 올바르지 않습니다.',
                400
            );

        let user = await this.authsRepository.findOneUserByEmail(email);

        if (!user) {
            user = await this.authsRepository.createUser(
                email,
                userName,
                profileImg,
                phoneNumber
            );
        }
        const accessToken = createUserToken(user.userId, '1h');
        const refreshToken = createUserToken('refreshToken', '1d');
        await this.authsRepository.updateRefreshToken(refreshToken, email);

        return { accessToken, refreshToken };
    };

    loginNaver = async (code, state, Naver) => {
        const result = await axios.post(
            'https://nid.naver.com/oauth2.0/token',
            {},
            {
                params: {
                    grant_type: 'authorization_code',
                    client_id: process.env.NAVER_CLIENT_ID,
                    client_secret: process.env.NAVER_SECRET,
                    code: code,
                    state: state,
                },
            }
        );
        const token = result.data.access_token;

        // 발급 받은 access token을 사용해 회원 정보 조회 API를 사용한다.
        const info_result = await axios.get(
            'https://openapi.naver.com/v1/nid/me',
            {
                headers: { Authorization: 'Bearer ' + token },
            }
        );
        const email = info_result.data.response.email;
        const userName = info_result.data.response.name;
        const profileImg = info_result.data.response.profile_image;
        const phoneNumber = info_result.data.response.mobile;

        let user = await this.authsRepository.findOneUserByEmail(email);

        if (!user) {
            user = await this.authsRepository.createUser(
                email,
                userName,
                profileImg,
                phoneNumber
            );
        }
        const accessToken = createUserToken(user.userId, '1h');
        const refreshToken = createUserToken('refreshToken', '1d');
        await this.authsRepository.updateRefreshToken(refreshToken, email);

        return { accessToken, refreshToken };
    };
}

module.exports = AuthsService;
