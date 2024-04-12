const Message = require('../models/chat');

exports.postSend = async (req,res,next) => {
    try{
        console.log(req.body);
        const message = req.body.message;
        console.log(req.user);
        userId = req.user.userId;
    
        const chat = await Message.create({message:message,userId:userId});
        console.log(chat,'chat created in database');
        res.status(201).json({message:'message successfully sent and created in database',data:chat})
    
    }
    catch(error){
        console.log(error,'error in cerating chat message in database in chat controller')
    }
}

exports.getAllChats= async (req,res,next) => {
    console.log('get chats in chat controller')
    const userId = req.user.userId;
    const chats = await Message.findAll();
    console.log(chats,'chats in getAllChats');
    res.status(201).json({message:'all chats fetched',data:chats})
}