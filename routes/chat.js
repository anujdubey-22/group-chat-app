const express = require("express");
const chatController = require("../controller/chat");
const verifyToken = require('../middleware/auth');

const router = express.Router();

router.post("/send", verifyToken , chatController.postSend);
router.get('/allchat',verifyToken,chatController.getAllChats);




module.exports = router;
