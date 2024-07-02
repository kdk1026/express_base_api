const express = require('express');
const router = express.Router();

const authJwt = require('../midlewares/authJwt');

router.get('/', function(req, res, next) {
    const obj = {};
    obj.test = '1234';
    obj.profile = process.env.profile;

    res.json(obj);
});

router.get('/auth', authJwt, function(req, res, next) {
    const user = req.userInfo;

    res.json(user);
});

module.exports = router;