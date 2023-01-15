const express = require('express');
const bcrypt = require('bcrypt');
const app = express();
const { encodeToken, authenticationMiddleware } = require('./authServer');

// Import created models
const User = require('../models/User');
const UserType = require('../models/UserType');

// Define entities relationship
UserType.hasMany(User);

//primeste datele de autentificare si intoarce un token de acces
app.post('/login', async (req, res, next) => {
  const params = req.body.userName;
  const pass = req.body.password;
  if (params && pass) {
    try {
      const user = await User.findOne({ where: { userName: params } });
      if (user) {
        if (await bcrypt.compare(pass, user.password)) {
          res.status(200).json({
            message: 'Success',
            token: encodeToken({ userId: user.id, userType: user.usertypeId }),
          }); 
        } else {
          res.status(403).json({ error: 'The password is incorrect' });
        }
      } else res.status(404).json({ error: 'User not found' });
    } catch (err) {
      next(err);
    }
  } else {
    res.status(400).json({ message: 'Malformed request!' });
  }
});

//intoarce datele utilizatorului autentificat
app.get('/logged', authenticationMiddleware, async (req, res) => {
  if (req.userId) {
   const user = await User.findByPk(req.userId);
    if (user) {
      const data = { ...user };
      delete data.password;
      res.status(200).json(data);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } else {
    res.status(400).json({ message: 'Malformed request!' });
  }
});

module.exports = app;
