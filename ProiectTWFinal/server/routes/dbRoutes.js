const express = require('express');
const app = express();
const sequelize = require('../database/sequelize');

// Import created models
const User = require('../models/User');
const UserType = require('../models/UserType');
const Aliment = require('../models/Aliment');

// Define entities relationship
UserType.hasMany(User);
User.belongsTo(UserType);
User.hasMany(Aliment, {foreignKey: 'creator'});
Aliment.belongsToMany(User,{ through: 'fridge'});// many to many
User.belongsToMany(Aliment, {through: 'fridge'});

// Create a special GET endpoint so that when it is called it will sync our database with the models.
 app.get('/create', async (req, res, next) => {
    try {
      await sequelize.sync({ force: true });
      res.status(201).json({ message: 'Database created with the models.' });
    } catch (err) {
      console.log(err);
      next(err);
    }
  });
  
app.get('/update', async (req, res, next) => {
    try {
      await sequelize.sync({ alter: true });
      res.status(201).json({ message: 'Database updated with the models.' });
    } catch (err) {
      console.log(err);
      next(err);
    }
  });
module.exports = app;  