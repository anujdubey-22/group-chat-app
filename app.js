const express = require('express');
const bodyParser = require("body-parser");
const cors = require('cors');
const sequelize = require('./database/database');
const userRouter = require('./routes/user');

const app = express();
app.use(cors({
    origin:"http://127.0.0.1:5500"
}));
app.use(bodyParser.json({extended:true}));

app.use('/user',userRouter);

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