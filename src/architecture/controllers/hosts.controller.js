const HostsService = require('../services/hosts.service');
const jwt = require('jsonwebtoken');

class HostsController {
    hostsService = new HostsService();

    //회원가입 API
    signUp = async (req, res) => {
        try {
            const { email, hostName, password, phoneNumber } = req.body;

            let profileImg = undefined;
            if (req.file) {
                profileImg = req.file.location;
            } else {
                profileImg =
                    'https://cdn-icons-png.flaticon.com/512/149/149071.png';
            }

            await this.hostsService.signUp(
                email,
                hostName,
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

    //아이디/닉네임 통합 중복확인 API
    findDup = async (req, res) => {
        const query = req.query;
        try {
            const message = await this.hostsService.findDup(query);
            res.status(200).json({ message });
        } catch (error) {
            console.log(error);
            if (error === '이미 사용중인 이메일입니다.') {
                return res.status(412).json({
                    errorMessage: '이미 사용중인 이메일입니다.',
                });
            }
            if (error === '이미 사용중인 닉네임입니다.') {
                return res.status(412).json({
                    errorMessage: '이미 사용중인 닉네임입니다.',
                });
            }
            res.status(400).json({
                errorMessage: '중복확인에 실패하였습니다.',
            });
        }
    };

    logIn = async (req, res) => {
        try {
            const { email, password } = req.body;

            const { accessToken, refreshToken } = await this.hostsService.logIn(
                email,
                password
            );
            const { hostId } = jwt.verify(
                accessToken,
                process.env.TOKEN_HOST_SECRET_KEY
            );
            console.log(`accessToken = ${accessToken}`);

            res.header({
                accesstoken: `Bearer ${accessToken}`,
                refreshtoken: `Bearer ${refreshToken}`,
            });
            res.status(200).json({
                hostId: hostId,
            });
        } catch (error) {
            console.log(error);
            if (error === '아이디 또는 패스워드가 일치하지 않습니다.') {
                return res.status(412).json({
                    errorMessage: '아이디 또는 패스워드가 일치하지 않습니다.',
                });
            }
            res.status(400).json({
                errorMessage: '로그인에 실패하였습니다.',
            });
        }
    };

    findOneHost = async (req, res) => {
        try {
            const { hostId } = req.params;
            const host = await this.hostsService.findOneHost(hostId);
            res.status(200).json({ host });
        } catch (error) {
            console.log(error);
            if (error === '존재하지 않는 사용자입니다.') {
                res.status(404).json({
                    errorMessage: '존재하지 않는 사용자입니다.',
                });
            }
            res.status(400).json({
                errorMessage: '사용자 정보 불러오기에 실패하였습니다.',
            });
        }
    };
}

module.exports = HostsController;
