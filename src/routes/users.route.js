const express = require('express');
const UsersController = require('../architecture/controllers/users.controller');
const usersController = new UsersController();
const router = express.Router();
const upload = require('../modules/profileImg.js');
const authLoginMiddleware = require('../middlewares/authLogin.middleware');

router.post('/signup', upload.single('profileImg'), usersController.signUp);
router.get('/signup/findDup', usersController.findDup);
router.post('/login', authLoginMiddleware, usersController.logIn);

module.exports = router;
