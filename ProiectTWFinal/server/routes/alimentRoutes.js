const express = require('express');
const app = express();
const { Op } = require('sequelize')
const moment = require('moment');
// Import created models
const User = require('../models/User');
const Aliment = require('../models/Aliment');
const { authenticationMiddleware } = require('./authServer');

// GET the list of aliments.
app.get('/', async (request, response, next) => {
  try {
    const aliments = await Aliment.findAll();
    const toReturn = [];
    if (aliments.length > 0) {
      for (let al of aliments) {
        const creator = await User.findByPk(al.creator);
        if (creator) {
          toReturn.push({
            id: al.id,
            category: al.category,
            name: al.name,
            date: al.date,
            available: al.available,
            creator: al.creator,
            creatorUser: creator
          })

        }
      }
      response.json(toReturn);
    } else {
      response.sendStatus(204);
    }
  } catch (error) {
    next(error);
  }
});
// GET the list of aliments posted by logged user
app.get('/users/:userId/:filter', authenticationMiddleware, async (req, response, next) => {
  try {
    if (req.userId == req.params.userId) {
      const user = await User.findByPk(req.params.userId);
      if (user) {
        let aliments = [];
        if (req.params.filter == 'Personale') {
          const Aliments = await Aliment.findAll({
            where: {
              creator: req.params.userId
            }
          })
          if (Aliments && Aliments.length > 0) {
            response.json(Aliments);
          }

        } else if (req.params.filter == 'claimed') {
          const ToReturn = [];
          const Aliments = await Aliment.findAll();
          for (let a of Aliments) {
            const users = await a.getUsers();
            for (let u of users) {
              if (u.id == req.userId) {
                ToReturn.push(a);
              }
            }
          }
          return response.json(ToReturn)
        }
        else if (req.params.filter == 'expiring') {
          const Aliments = await Aliment.findAll({
            where: {
              date: {
                [Op.lte]: moment().add(3, 'days').toDate()
              }
            }
          })
          if (Aliments && Aliments.length > 0) {
            response.json(Aliments);
          }
        }
        else {
          let alimentsAll = await Aliment.findAll();
          aliments = alimentsAll.filter((act, i) => act.category == req.params.filter)
        }
        if (aliments.length > 0) {
          response.json(aliments);
        } else {
          response.sendStatus(204);
        }
      } else {
        response.status(404).json({ message: 'User not found!' });
      }
    }
    else response.status(403).json({ message: 'Your are not the user!' })
  } catch (error) {
    next(error);
  }
});
app.get('/expiring', async (req, res, next) => {
  try {
    const Aliments = await Aliment.findAll({
      where: {
        date: {
          [Op.lte]: moment().add(3, 'days').toDate()
        }
      }
    })
    if (Aliments && Aliments.length > 0) {
      res.json(Aliments);
    }
    else res.json([]);
  } catch (err) {
    next(err);
  }
});

// GET an aliment by id.
app.get('/:alimentId', async (request, response, next) => {
  try {
    const aliment = await Aliment.findByPk(request.params.alimentId);
    if (aliment) {
      response.json(aliment);
    } else {
      response.sendStatus(404);
    }
  } catch (error) {
    next(error);
  }
});

// POST a new aliment made by a user.
app.post('/:userId', authenticationMiddleware, async (req, response, next) => {
  try {
    if (req.userId == req.params.userId) {
      const user = await User.findByPk(req.params.userId);
      if (user) {
        if (req.body.category && req.body.name && req.body.date) {
          const par = {
            category: req.body.category,
            name: req.body.name,
            date: new Date(req.body.date),
            creator: req.params.userId
          };
          const aliment = await Aliment.create(par);
          user.addAliment(aliment);
          aliment.addUser(user);
          await aliment.save();
          await user.save();
          response.status(201).json({ message: 'Aliment Created!' });
        }
        else response.status(400).json({ message: 'Malformed request!' });
      } else {
        response.status(404).json({ message: 'User not found!' });
      }
    }
    else response.status(403).json({ message: 'Your are not the user!' })
  } catch (error) {
    next(error);
  }
});

// claim an aliment 
app.put('/:alimentId/claim', authenticationMiddleware, async (req, response, next) => {
  try {
    const user = await User.findByPk(req.userId);
    if (user) {
      const aliment = Aliment.findByPk(req.params.alimentId);
      if (aliment) {
        aliment.addUser(user);
        await aliment.save();
         response.status(201).json({ message: 'Aliment claimed!' });
      } else {
        response.status(404).json({ error: 'Aliment not found!' });
      }
    } else {
      response.status(404).json({ error: 'User not found!' });
    }

  } catch (error) {
    next(error);
  }
});

// PUT to update an aliment.
app.put('/:alimentId', authenticationMiddleware, async (request, response, next) => {
  try {
    const aliment = await Aliment.findByPk(request.params.alimentId);
    if (aliment && aliment.creator == request.userId) {
      let available = aliment.available;
      await aliment.update({ available: !available });
      response.status(200).json(aliment);
    } else {
      response.status(404).json({ message: "aliment not found!" });
    }
  } catch (error) {
    next(error);
  }
});

// DELETE an aliment.
app.delete('/:alimentId', authenticationMiddleware, async (request, response, next) => {
  try {
    if (request.userType == '2') {
      const aliment = await Aliment.findByPk(request.params.alimentId);
      if (aliment) {
        if (aliment.creator == request.userId) {
          await aliment.destroy();
          response.status(200).json({ message: "Deleted!" });
        } else {
          response.status(404).json({ message: 'Your are not the user!' + request.userId + aliment.creator })
        }
      }
      else {
        response.status(404).json({ message: 'Aliment not found!' })
      }
    }
    else response.status(403).json({ message: 'Your are not the user!' })
  } catch (error) {
    next(error);
  }
});

module.exports = app; 