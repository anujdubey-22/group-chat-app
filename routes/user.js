const express = require('express');
const userController = require('../controller/user');
const router = express.Router();

router.post('/signup',userController.postSignup);

router.post('/login',userController.postLogin);

module.exports = router;