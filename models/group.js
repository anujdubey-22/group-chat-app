const Sequelize = require("sequelize");
const sequelize = require("../database/database");

const Group = sequelize.define("group", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  group: {
    type: Sequelize.STRING,
    allowNull: false,
  }
});

module.exports = Group;
