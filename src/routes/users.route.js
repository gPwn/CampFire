const express = require('express');
const UsersController = require('../architecture/controllers/users.controller');
const usersController = new UsersController();
const router = express.Router();
const upload = require('../modules/profileImg.js');
const authLoginUserMiddleware = require('../middlewares/authLoginUser.middleware');

router.post('/signup', upload.single('profileImg'), usersController.signUp);
router.get('/signup/findDup', usersController.findDup);
router.post('/login', authLoginUserMiddleware, usersController.logIn);
router.get('/:userId', usersController.findOneUser);

module.exports = router;
