const Message = require('../models/chat');

exports.postSend = async (req,res,next) => {
    try{
        console.log(req.body);
        const message = req.body.message;
        console.log(req.user);
        userId = req.user;
    
        const chat = await Message.create({message:message,userId:userId});
        console.log(chat,'chat created in database');
        res.status(201).json({message:'message successfully sent and created in database',message:chat})
    
    }
    catch(error){
        console.log(error,'error in cerating chat message in database in chat controller')
    }
}