const bcrypt = require("bcrypt");
const User = require("../models/user");

const saltRounds = 10;

exports.postSignup = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;
    //console.log(req.body);

    // check if email already exists or not if email exist then return the error.
    const existingUser = await User.findOne({ where: { email: email } });

    if (existingUser) {
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
        res.status(201).json({msg:"User successfuly signup",data:user});
      } else {
        console.log(err, "error in hashing");
        return res.status(404).send("Error in hashing");
      }
    });
  } catch (error) {}
};
