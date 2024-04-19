const Message = require("../models/chat");
const User = require("../models/user");
const Group = require("../models/group");
const UserGroup = require("../models/usergroup");
const { Op } = require("sequelize");
const Sequelize = require("sequelize");
const AWS = require("aws-sdk");

function uploadtoS3(data, filename) {
    return new Promise((resolve, reject) => {
      //console.log(process.env.IAM_USER_KEY,' process.env.IAM_USER_KEYyyyyy');
      const BUCKET_NAME = process.env.BUCKET_NAME;
      const IAM_USER_KEY = process.env.IAM_USER_KEY;
      const IAM_USER_SECRET = process.env.IAM_USER_SECRET;
  
      let s3bucket = new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET,
      });
  
      var params = {
        Bucket: BUCKET_NAME,
        Key: filename,
        Body: data,
        ACL: "public-read",
      };
      s3bucket.upload(params, (err, s3response) => {
        if (err) {
          console.log(err, "Something went wrong in s3 createbucket");
          reject("Something went wrong in s3 createbucket");
        } else {
          console.log(s3response, "success in s3 createbucket");
          console.log(s3response.Location, "urlllll");
          resolve(s3response.Location);
        }
      });
    });
  }

exports.postSend = async (req, res, next) => {
  let chat = null;
  try {
    console.log(req.body);
    const message = req.body.message;
    const groupName = req.body.groupName;
    console.log(req.user, groupName, "groupnamemmmmmmmmmmmmm");
    userId = req.user.userId;

    // Check if groupName is defined
    if (groupName !== "") {
      const group = await Group.findOne({
        where: {
          group: groupName,
        },
      });
      console.log(group, "group in sending chat");
      if (group) {
        const groupId = group.dataValues.id;
        console.log(groupId, "groupid");
        chat = await Message.create({
          message: message,
          userId: userId,
          groupId: groupId,
        });
        console.log(chat, "chat created in database");
      } else {
        throw new Error("the room provided is not correct kindly check");
      }
    } else {
      chat = await Message.create({ message: message, userId: userId });
      console.log(chat, "chat created in database");
    }
    res.status(201).json({
      message: "message successfully sent and created in database",
      data: chat,
    });
  } catch (error) {
    console.log(
      error,
      "error in cerating chat message in database in chat controller"
    );
    res.status(400).json({ msg: "something went wrong in creating chat" });
  }
};

exports.getAllChats = async (req, res, next) => {
  try {
    console.log("get chats in chat controller");
    const userId = req.user.userId;
    const chats = await Message.findAll({
      where: {
        [Op.or]: [
          { groupid: null }, // messages without a groupid
          {
            groupid: {
              [Op.in]: Sequelize.literal(
                `(SELECT groupid FROM UserGroups WHERE userid = ${userId})`
              ),
            },
          }, // messages with groupid associated with userId in UserGroups
        ],
      },
      include: [
        {
          model: Group,
        },
      ],
    });

    //console.log(chats);
    console.log(
      "chats startinf from hereeeeeeeeeeeeeeeee",
      chats,
      "chats in getAllChats"
    );
    res.status(201).json({ message: "all chats fetched", data: chats });
  } catch (error) {
    console.error(error);
  }
};

exports.postChatDownload = async (req, res, next) => {
  try {
    console.log("in  download chats in chat controller");
    const userId = req.user.userId;
    const chats = await Message.findAll({
      where: {
        [Op.or]: [
          { groupid: null }, // messages without a groupid
          {
            groupid: {
              [Op.in]: Sequelize.literal(
                `(SELECT groupid FROM UserGroups WHERE userid = ${userId})`
              ),
            },
          }, // messages with groupid associated with userId in UserGroups
        ],
      },
      include: [
        {
          model: Group,
        },
      ],
    });

    console.log(chats, "chats  in chat controllerrrrr ");
    const stringified = JSON.stringify(chats);
    console.log(stringified, "stringifieddddddddddd");
    const filename = `Chats${userId}/${new Date()}.txt`;
    const fileUrl = await uploadtoS3(stringified, filename);
    console.log(fileUrl, "fileUrl in getDownloaddd");
    //console.log(new Date().toLocaleDateString())
    res.status(201).json({ fileUrl, success: true });
  } catch (error) {
    console.log(error, "error in getDownload");
    res.status(500).json({ success: false });
  }
};
