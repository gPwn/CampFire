const express = require('express');
const router = express.Router();

//router.use('/camps', require('./camps.route.js'));
router.use('/users', require('./users.route.js'));
router.use('/hosts', require('./hosts.route.js'));

router.get('/', (req, res) => {
    res.send('api routes 연결');
});

module.exports = router;
