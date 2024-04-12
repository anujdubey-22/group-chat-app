const Sequelize = require("sequelize");
const sequelize = require("../database/database");

const Message = sequelize.define("message", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  message: {
    type: Sequelize.STRING,
    allowNull: false,
  }
});

module.exports = Message;
