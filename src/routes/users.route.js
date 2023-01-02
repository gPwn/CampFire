const express = require('express');
const UsersController = require('../architecture/controllers/users.controller');
const usersController = new UsersController();
const router = express.Router();
const upload = require('../modules/profileImg.js');

router.post('/signup', upload.single('profileImg'), usersController.signUp);

module.exports = router;
