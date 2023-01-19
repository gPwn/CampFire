const UsersRepository = require('../repositories/users.repository');
const AuthsRepository = require('../repositories/auths.repository.js');
const axios = require('axios');
const request = require('request');
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

    loginNaver = async (code, state, Naver) => {
        console.log('서비스들어옴');
        console.log(Naver.client_id);
        const naver_api_url = `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${Naver.client_id}&client_secret=${Naver.client_secret}&code=${code}&state=${state}`;
        console.log(naver_api_url);
        const result = await axios.post(
            'https://nid.naver.com/oauth2.0/token',
            {},
            {
                params: {
                    grant_type: 'authorization_code',
                    client_id: Naver.client_id,
                    client_secret: Naver.client_secret,
                    code: code,
                    state: state,
                },
            }
        );
        const token = result.data.access_token;
        console.log(token);

        // 발급 받은 access token을 사용해 회원 정보 조회 API를 사용한다.
        const info_result = await axios.get(
            'https://openapi.naver.com/v1/nid/me',
            {
                headers: { Authorization: 'Bearer ' + token },
            }
        );
        console.log('info_result type=', typeof info_result);
        // string 형태로 값이 담기니 JSON 형식으로 parse를 해줘야 한다.
        console.log('info_result= ', info_result);
        return info_result;
    };
}

module.exports = AuthsService;
