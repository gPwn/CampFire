const express = require('express');
const HostsController = require('../architecture/controllers/hosts.controller');
const hostsController = new HostsController();
const router = express.Router();
const upload = require('../modules/profileImg.js');
const authLoginHostMiddleware = require('../middlewares/authLoginHost.middleware');

router.post('/signup', upload.single('profileImg'), hostsController.signUp);
router.get('/signup/findDup', hostsController.findDup);
router.post('/login', authLoginHostMiddleware, hostsController.logIn);

module.exports = router;
