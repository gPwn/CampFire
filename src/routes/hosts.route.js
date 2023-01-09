const express = require('express');
const HostsController = require('../architecture/controllers/hosts.controller');
const hostsController = new HostsController();
const router = express.Router();
const upload = require('../modules/profileImg.js');
const authLoginHostMiddleware = require('../middlewares/authLoginHost.middleware');
const authHostMiddleware = require('../middlewares/authHost.middleware');

router.post('/signup', upload.single('profileImg'), hostsController.signUp);
router.get('/signup/findDup', hostsController.findDup);
router.post('/signup/checkCompany', hostsController.checkCompany);
router.post('/login', authLoginHostMiddleware, hostsController.logIn);
router.get('/:hostId', hostsController.findOneHost);
router.put(
    '/:hostId',
    authHostMiddleware,
    upload.single('profileImg'),
    hostsController.updateHost
);
router.delete('/:hostId', authHostMiddleware, hostsController.deleteHost);

module.exports = router;
