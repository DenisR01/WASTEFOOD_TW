const sequelize = require('../database/sequelize');
const  DataTypes  = require('sequelize');

const Aliment = sequelize.define('aliment',{
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },   
    category: {
        type: DataTypes.STRING,
        allowNull: false,
        notEmpty: true
    },
    name : {
        type: DataTypes.STRING,
        allowNull: false,
        notEmpty: true
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
        notEmpty: true
    },
    available:{
        type:DataTypes.BOOLEAN,
        defaultValue: false
    }
});

module.exports = Aliment;