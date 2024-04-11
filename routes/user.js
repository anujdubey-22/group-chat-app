const express = require('express');
const controller = require('../controller/user');
const router = express.Router();

router.post('/signup',controller.postSignup);

router.post('/login',controller.postLogin);

module.exports = router;