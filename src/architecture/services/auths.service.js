const UsersRepository = require('../repositories/users.repository');
const AuthsRepository = require('../repositories/auths.repository.js');
const axios = require('axios');
const { Users } = require('../../models');
require('dotenv').config();
const hash = require('../../util/auth-encryption.util');
const { createUserToken } = require('../../util/auth-jwtToken.util.js');
const { ValidationError } = require('../../middlewares/exceptions/error.class');

const KAKAO_OAUTH_TOKEN_API_URL = 'https://kauth.kakao.com/oauth/token';
const GRANT_TYPE = 'authorization_code';
const CLIENT_id = process.env.CLIENT_id;
const REDIRECT_URL = 'https://campfire-fe.vercel.app/api/auths/kakao';

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
                    client_id: process.env.CLIENT_ID,
                    code,
                    redirect_uri: REDIRECT_URL,
                },
            }
        );
        const data = resultPost.data['access_token'];
        console.log(data);

        const resultGet = await axios.get('https://kapi.kakao.com/v2/user/me', {
            headers: {
                Authorization: `Bearer ${data}`,
                'Content`Type': `application/x-www-form-urlencoded;charset=utf-8`,
            },
        });

        const email = resultGet.data.kakao_account['email'];
        const userName = resultGet.data.properties['nickname'];
        const profileImg = resultGet.data.properties['profile_image'];

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
                profileImg
            );
        }
        const accessToken = createUserToken(user.userId, '1h');
        const refreshToken = createUserToken('refreshToken', '1d');
        await this.authsRepository.updateRefreshToken(refreshToken, email);

        return { accessToken, refreshToken };
    };
}

module.exports = AuthsService;
