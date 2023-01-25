const AuthsService = require('../services/auths.service.js');
const jwt = require('jsonwebtoken');

class AuthsController {
    authsService = new AuthsService();

    //회원가입 API
    signup = async (req, res) => {
        try {
            const { email, userName, password, phoneNumber } = req.body;

            let profileImg = undefined;
            if (req.file) {
                profileImg = req.file.location;
            } else {
                profileImg =
                    'https://cdn-icons-png.flaticon.com/512/149/149071.png';
            }

            await this.authsService.signUp(
                email,
                userName,
                password,
                phoneNumber,
                profileImg
            );

            res.status(201).json({ message: '회원가입에 성공하였습니다.' });
        } catch (error) {
            console.log(error);
            res.status(400).json({
                errorMessage: '회원가입에 실패하였습니다.',
            });
        }
    };

    loginKakao = async (req, res) => {
        try {
            let code = req.query.code;
            const { accessToken, refreshToken } =
                await this.authsService.loginKakao(code);

            const { userId } = jwt.verify(
                accessToken,
                process.env.TOKEN_USER_SECRET_KEY
            );
            console.log(`accessToken = ${accessToken}`);

            res.header({
                accesstoken: `Bearer ${accessToken}`,
                refreshtoken: `Bearer ${refreshToken}`,
            });
            res.status(200).json({
                userId: userId,
            });
        } catch (error) {
            console.log(error);
            res.status(400).json({ errorMessage: '로그인 실패' });
        }
    };

    loginNaver = async (req, res) => {
        try {
            const code = req.query.code;
            const state = req.query.state;

            const { accessToken, refreshToken } =
                await this.authsService.loginNaver(code, state);
            const { userId } = jwt.verify(
                accessToken,
                process.env.TOKEN_USER_SECRET_KEY
            );
            console.log(`accessToken = ${accessToken}`);

            res.header({
                accesstoken: `Bearer ${accessToken}`,
                refreshtoken: `Bearer ${refreshToken}`,
            });
            res.status(200).json({
                userId: userId,
            });
        } catch (error) {
            console.log(error);
            res.status(400).json({ errorMessage: '네이버 로그인 실패' });
        }
    };

    loginGoogle = async (req, res) => {
        try {
            console.log('loginGoogle들어옴!');
            let code = req.query.code;
            const { accessToken, refreshToken } =
                await this.authsService.loginGoogle(code);

            const { userId } = jwt.verify(
                accessToken,
                process.env.TOKEN_USER_SECRET_KEY
            );
            console.log(`accessToken = ${accessToken}`);

            res.header({
                accesstoken: `Bearer ${accessToken}`,
                refreshtoken: `Bearer ${refreshToken}`,
            });
            res.status(200).json({
                userId: userId,
            });
        } catch (error) {
            console.log(error);
            res.status(400).json({ errorMessage: '구글 로그인 실패' });
        }
    };
}
module.exports = AuthsController;
