const express = require('express');
const router = express.Router();

router.use('/users', require('./users.route.js'));
router.use('/hosts', require('./hosts.route.js'));
router.use('/camps', require('./camps.route.js'));

router.get('/', (req, res) => {
    res.send('api routes 연결 cicd test');
});

module.exports = router;
