const User = require("../models/user");
const Group = require("../models/group");
const Admin = require("../models/admin");
const UserGroup = require('../models/usergroup');
const Message = require("../models/chat");


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

exports.deleteGroup = async(req,res,next)=> {
    try{
        const groupId = req.body.groupId;
        console.log(
          req.user,
          groupId,
          "groupId with userid in group controller"
        );
        const userId = req.user.userId;

        //check for userid is admin or not
        const checkUser = await Admin.findOne({ where: { groupId: groupId, userId: userId } });
        if(checkUser){
          // if user is admin then check if given groupid exist in group table or not
            const checkGroup = await Group.findByPk(groupId);
            if(checkGroup){
                const deleteMessage = await Message.destroy({where:{groupId:groupId}});
                const deleteGroup = await Group.destroy({where:{id:groupId}});
                const deletUserGroup = await UserGroup.destroy({where : {groupId:groupId}});
                const deleteAdmin = await Admin.destroy({where:{groupId:groupId}});
                res.status(201).json({msg:'group deleted successfuly'});
            }
            else{
                throw new Error('groupId provided does not exist');
            }
        }
        else{
            throw new Error('userId provided is notAdmin to perform delete task');
        }


    }
    catch(error){
        console.log(error,'error in deleting group in group controller');
        res.status(400).json({msg:'error in deleting in group controller'});
    }
}