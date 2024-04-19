const Message = require("../models/chat");
const User = require("../models/user");
const Group = require("../models/group");
const UserGroup = require("../models/usergroup");
const { Op } = require("sequelize");
const Sequelize = require("sequelize");

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
  console.log(stringified,'stringifieddddddddddd');
};
