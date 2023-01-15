const sequelize = require('../database/sequelize');
const  DataTypes  = require('sequelize');

const UserType = sequelize.define('usertype',{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },   
    description: {
        type: DataTypes.STRING,
        allowNull: false,
        notEmpty: true
    }
});

module.exports = UserType;