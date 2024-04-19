const jwt = require('jsonwebtoken');
const User = require('../models/user');


const verifyToken = async (req,res,next) => {
    try{
        console.log(req.header,'req.headerrrrrrrrrrrrrrrr')
        const token = req.header('authorization');
        console.log(token,'token in auth.js');
        const user = jwt.verify(token, 'shhhhh fir koi hai');
        console.log(user.userId,'user in auth');
        const data = await User.findByPk(user.userId);
        req.user = user;
        next();
    }
    catch(error){
        console.log(error,'error in authorization middleware');
    }
}

module.exports = verifyToken;