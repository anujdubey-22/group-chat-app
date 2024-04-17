const express = require('express');
const bodyParser = require("body-parser");
const cors = require('cors');
const sequelize = require('./database/database');
const userRouter = require('./routes/user');
const chatRouter = require('./routes/chat');
const User = require('./models/user');
const Message = require('./models/chat');
const Group = require('./models/group');
const UserGroup = require('./models/usergroup');
const grouprouter = require('./routes/group');
const Admin = require('./models/admin');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ["http://127.0.0.1:5500"]
  }
});


io.on('connection', (socket) => {
  socket.on('sendMessage', (msg) => {
    console.log('message in socket: ' + msg);
  });
});


app.use(cors({
  origin:"http://127.0.0.1:5500"
}));
app.use(bodyParser.json({extended:true}));

app.use('/user',userRouter);
app.use('/chat',chatRouter);
app.use('/group',grouprouter);

User.hasMany(Message);
Message.belongsTo(User);

User.belongsToMany(Group, { through: UserGroup });
Group.belongsToMany(User, { through: UserGroup });

User.belongsToMany(Group, { through: Admin });
Group.belongsToMany(User, { through: Admin });

Group.hasMany(Message);
Message.belongsTo(Group);

async function sync() {
    try {
      const data = await sequelize.sync();
      //console.log(data);
      server.listen(process.env.PORT || 3000 , () => {
        console.log("server started on Port 3000");
      });
    } catch (error) {
      console.log(error, "error in sync database in app.js");
    }
  }
  
  sync();