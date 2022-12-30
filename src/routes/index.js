const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('api routes 연결');
});

module.exports = router;
