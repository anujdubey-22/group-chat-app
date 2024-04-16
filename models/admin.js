const Sequelize = require("sequelize");
const sequelize = require("../database/database");

const Admin = sequelize.define("admin", {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      }
});

module.exports = Admin;
