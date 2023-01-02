const UsersService = require('../services/users.service');
const jwt = require('jsonwebtoken');

class UsersController {
    usersService = new UsersService();

    //회원가입 API
    signUp = async (req, res) => {
        try {
            const { email, userName, password, phoneNumber } = req.body;

            let profileImg = undefined;
            if (req.file) {
                profileImg = req.file.location;
            } else {
                profileImg =
                    'https://cdn-icons-png.flaticon.com/512/149/149071.png';
            }

            await this.usersService.signUp(
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
}

module.exports = UsersController;
