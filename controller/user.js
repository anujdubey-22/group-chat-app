const bcrypt = require("bcrypt");
const User = require("../models/user");
const Admin = require('../models/admin');
const UserGroup = require('../models/usergroup');
const jwt = require("jsonwebtoken");

const saltRounds = 10;

function generateToken(id) {
  console.log(id, "id in generateToken");
  var token = jwt.sign({ userId: id }, "shhhhh fir koi hai");
  return token;
}

exports.postSignup = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;
    //console.log(req.body);

    // check if email already exists or not if email exist then return the error.
    const existingUser = await User.findOne({ where: { email: email } });
    console.log(existingUser, "existinguser");
    if (existingUser) {
      console.log("hello");
      return res.status(409).json({ message: "Email already exists" });
    }

    bcrypt.hash(password, saltRounds, async function (err, hash) {
      if (!err) {
        // Store hash in your password DB.
        const user = await User.create({
          name: name,
          email: email,
          password: hash,
          phone: phone,
        });

        res.status(201).json({ msg: "User successfuly signup", data: user });
      } else {
        console.log(err, "error in hashing");
        return res.status(404).send("Error in hashing");
      }
    });
  } catch (error) {}
};

exports.postLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    //console.log(email,password);
    const data = await User.findOne({ where: { email: email } });
    if (data === null) {
      return res.status(404).json("email does not exist");
    }
    //console.log(data)
    //console.log(data.email);
    if (data.password == null) {
      return res.status(401).json("password does not match");
    }
    if (data.password != null) {
      const hash = data.password;
      const match = bcrypt.compareSync(password, hash);
      console.log(match, "password match");
      //console.log(email,data.email)
      if (match && email === data.email) {
        res.status(201).json({
          message: "User Login Successfully",
          data: data,
          token: generateToken(data.id),
        });
      } else {
        res.status(401).json("password does not match");
      }
    }
  } catch (error) {
    console.log(error, "error in validate Post in controller");
  }
};

exports.postAddUser = async (req, res, next) => {
  try{
    const anotherUserId = parseInt(req.query.secondId);
    console.log("in postAddUser in user controllerrrrrrrrrrrrrrrrrrrrrrr");
    const userId = req.user.userId;
    const groupId = req.body.groupId
    console.log(anotherUserId,groupId,'anotheruserid,groupiddddddddddddddddddddddddd')
  
    const checkUser = await User.findByPk(userId);
    if(checkUser){
      console.log('checkUser existttttttttttttttttttttt')
      const admin = await Admin.create({userId:anotherUserId,groupId:groupId});
      console.log(admin,'admin created in user controller');
    
      const userGroup = await UserGroup.create({userId:anotherUserId,groupId:groupId});
      console.log(userGroup,'userGroup in user controller');
      res.status(201).json('admin created succesfully');
    }
    else{
      throw new Error('anotherUserId provided does not exist');
    }
  }
  catch(error){
    console.log(error,'error in creating admin in user controller');
  }
};
