const User = require("../models/user");
const Group = require("../models/group");
const Admin = require("../models/admin");

exports.postCreateGroup = async (req, res, next) => {
  try {
    const groupName = req.body.groupName;
    console.log(
      req.user,
      groupName,
      "groupnamw with userid in group controller"
    );
    const userId = req.user.userId;

    const user = await User.findByPk(userId);
    const group = await Group.create({ group: groupName });
    const data = await user.addGroup(group);
    //console.log(group,'group in creating group')

    const groupId = data[0].dataValues.groupId;

    console.log(data, "data in group controller");
    // Add the same user and group to the Admin table
    const admin = await Admin.create({ userId: userId, groupId: groupId });
    console.log(admin, "admin created");

    res.status(201).json({ message: "gorup create done", group: group });
  } catch (error) {
    console.log(error, "error in creating group name");
  }
};

exports.getGroup = async (req, res, next) => {
  try {
    userId = req.user.userId;

    const user = await User.findByPk(userId);
    const groups = await user.getGroups();
    console.log(groups, "all groups in group controller");
    res.status(201).json({ message: "all groups fetched", groups: groups });
  } catch (error) {
    console.log(error, "error in getting groups");
  }
};
