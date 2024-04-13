const express = require('express');
const bodyParser = require("body-parser");
const cors = require('cors');
const sequelize = require('./database/database');
const userRouter = require('./routes/user');
const chatRouter = require('./routes/chat');
const User = require('./models/user');
const Message = require('./models/chat');
const Group = require('./models/group');
const { group } = require('console');

const app = express();
app.use(cors({
    origin:"http://127.0.0.1:5500"
}));
app.use(bodyParser.json({extended:true}));

app.use('/user',userRouter);
app.use('/chat',chatRouter);

User.hasMany(Message);
Message.belongsTo(User);

User.hasMany(Group);
Group.belongsTo(User);

Group.hasMany(Message);
Message.belongsTo(Group);

async function sync() {
    try {
      const data = await sequelize.sync();
      //console.log(data);
      app.listen(process.env.PORT || 3000 , () => {
        console.log("server started on Port 3000");
      });
    } catch (error) {
      console.log(error, "error in sync database in app.js");
    }
  }
  
  sync();