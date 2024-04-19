const express = require('express');
const userController = require('../controller/user');
const router = express.Router();
const verifyToken = require('../middleware/auth');

router.post('/signup',userController.postSignup);

router.post('/login',userController.postLogin);

router.post('/adduser',verifyToken,userController.postAddUser);

module.exports = router;