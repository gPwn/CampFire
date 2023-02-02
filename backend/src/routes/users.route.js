const express = require('express');
const UsersController = require('../architecture/controllers/users.controller');
const usersController = new UsersController();
const router = express.Router();
const upload = require('../modules/profileImg.js');
const authLoginUserMiddleware = require('../middlewares/authLoginUser.middleware');
const authUserMiddleware = require('../middlewares/authUser.middleware');

router.post('/signup', upload.single('profileImg'), usersController.signUp);
router.get('/signup/findDup', usersController.findDup);
router.post('/login', authLoginUserMiddleware, usersController.logIn);
router.get('/:userId', usersController.findOneUser);
router.put(
    '/:userId',
    authUserMiddleware,
    upload.single('profileImg'),
    usersController.updateUser
);
router.delete('/', authUserMiddleware, usersController.deleteUser);
// 문자 인증
router.get('/sms/:phoneNumber', usersController.sendMessage);
router.post('/sms/verify', usersController.verifyCode);
// 유저 이메일 찾기
router.get('/find/userEmail', usersController.findUserEmail);
// 유저 비밀번호 변경하기
router.put('/update/userPW', usersController.updateUserPW);

module.exports = router;
