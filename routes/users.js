'use strict'

const express = require('express');
const userRouter = express.Router();
const models = require('../models');
const Page = models.Page;
const User = models.User;

userRouter.get('/', function(req, res, next) {
  User.findAll({

  })
  .then(function(users) {
    res.render('users', {
      users: users
    })
  })
  .catch(next);
})

userRouter.get('/:id', function(req, res, next) {
  let id = req.params.id;
  Page.findAll({
    where: {
      authorId: id
    }
  })
  .then(function(usersArticles) {
    res.render('usersid', {
      usersArticles: usersArticles
    })
  })
})

module.exports = userRouter;
