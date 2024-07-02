const express = require('express');
const router = express.Router();

const test = require('./test');
const login = require('./login');

router.use('/test', test);
router.use('/login', login);

module.exports = router;