const express = require("express");
const groupController = require("../controller/group");
const verifyToken = require('../middleware/auth');

const router = express.Router();

router.post("/creategroup", verifyToken , groupController.postCreateGroup);
router.get('/getgroup',verifyToken,groupController.getGroup);
router.post('/groupdelete',verifyToken,groupController.deleteGroup);


module.exports = router;