const express = require('express');
const UsersController = require('../architecture/controllers/users.controller');
const usersController = new UsersController();
const router = express.Router();
const upload = require('../modules/profileImg.js');

router.post('/signup', upload.single('profileImg'), usersController.signUp);
router.get('/signup/findDup', usersController.findDup);

module.exports = router;
