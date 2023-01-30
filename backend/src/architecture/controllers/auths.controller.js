const AuthsService = require('../services/auths.service.js');
const jwt = require('jsonwebtoken');

class AuthsController {
    authsService = new AuthsService();

    loginKakao = async (req, res) => {
        try {
            let code = req.query.code;
            const result = await this.authsService.loginKakao(code);

            if (result.accessToken && result.refreshToken) {
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
            } else {
                res.status(200).json({ user: result });
            }
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

    sendMessage = async (req, res) => {
        try {
            const phoneNumber = req.params;
            await this.authsService.sendMessage(phoneNumber);
            return res.status(200).json({ message: '인증번호 발송됨!' });
        } catch (error) {
            console.log(error);
            res.status(400).json({ errorMessage: '인증번호 발송 실패' });
        }
    };
}
module.exports = AuthsController;
