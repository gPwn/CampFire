const HostsService = require('../services/hosts.service');
const jwt = require('jsonwebtoken');
const request = require('request');
const companyServiceKey = 'a3NuMDMwMTJAbmF2ZXIuY29t';

class HostsController {
    hostsService = new HostsService();

    //회원가입 API
    signUp = async (req, res) => {
        try {
            const {
                email,
                hostName,
                password,
                brandName,
                companyNumber,
                phoneNumber,
            } = req.body;

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
                brandName,
                companyNumber,
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

    //사업자 번호 체크!
    checkCompany = async (req, res) => {
        try {
            const { brandName, companyNumber } = req.body;
            companyData(companyNumber, ({ company } = {}) => {
                const obj = JSON.parse(company);
                if (
                    obj.items.length !== 0 &&
                    obj.items[0].company === brandName
                )
                    res.status(200).json({
                        message: '사업자등록 확인이 성공하였습니다.',
                    });
                else
                    res.status(400).json({
                        errorMessage: '사업자등록 확인이 실패하였습니다.',
                    });
            });
        } catch (error) {
            console.log(error);
            res.status(400).json({
                errorMessage: '사업자등록 확인이 실패하였습니다.',
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
                return res.status(404).json({
                    errorMessage: '존재하지 않는 사용자입니다.',
                });
            }
            res.status(400).json({
                errorMessage: '사용자 정보 불러오기에 실패하였습니다.',
            });
        }
    };

    updateHost = async (req, res) => {
        try {
            const { hostId } = req.params;

            const tokenHostId = res.locals.hostId;
            console.log(tokenHostId);
            const { hostName, phoneNumber } = req.body;
            let profileImg = undefined;

            if (req.file) {
                profileImg = req.file.location;
            } else if (req.body.profileImg === 'null') {
                profileImg =
                    'https://cdn-icons-png.flaticon.com/512/149/149071.png';
            }

            await this.hostsService.updateHost(
                hostId,
                hostName,
                phoneNumber,
                tokenHostId,
                profileImg
            );
            return res
                .status(201)
                .json({ message: '사용자 정보가 수정되었습니다.' });
        } catch (error) {
            console.log(error);
            if (error.message === '존재하지않는 사용자입니다.') {
                return res
                    .status(404)
                    .json({ errorMessage: '존재하지않는 사용자입니다.' });
            }
            if (error.message === '권한이 없습니다.') {
                return res
                    .status(401)
                    .json({ errorMessage: '권한이 없습니다.' });
            }
            res.status(400).json({
                errorMessage: '사용자 정보 수정에 실패하였습니다.',
            });
        }
    };

    deleteHost = async (req, res) => {
        const { password } = req.body;
        const hostId = res.locals.hostId;
        try {
            await this.hostsService.deleteHost(hostId, password);
            return res.status(200).json({
                message: '회원탈퇴에 성공하였습니다.',
            });
        } catch (error) {
            console.log(error);

            if (error.message === '비밀번호가 일치하지 않습니다.')
                return res
                    .status(412)
                    .json({ errorMessage: '비밀번호가 일치하지 않습니다.' });

            res.status(400).json({
                errorMessage: '회원탈퇴에 실패하였습니다',
            });
        }
    };
}

const companyData = (companyNumber, callback) => {
    const url = 'https://bizno.net/api/fapi?';
    let queryParams = encodeURIComponent('key') + '=' + companyServiceKey;
    queryParams += '&' + encodeURIComponent('gb') + '=' + 1;
    queryParams += '&' + encodeURIComponent('q') + '=' + companyNumber;
    queryParams += '&' + encodeURIComponent('type') + '=' + 'json';

    request(
        {
            url: url + queryParams,
            method: 'GET',
        },
        function (error, response, body) {
            callback({
                company: body,
            });
        }
    );
};

module.exports = HostsController;
