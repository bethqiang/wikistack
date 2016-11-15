'use strict'

const express = require('express');
const router = express.Router();

const models = require('../models');
const Page = models.Page;
const User = models.User;

router.get('/', function(req, res, next) {
  User.findAll({})
  .then(function(users) {
    res.render('users', {
      users: users
    })
  })
  .catch(next);
})

router.get('/:userId', function(req, res, next) {
  const findUser = User.findById(req.params.userId)

  const findPages = Page.findAll({
    where: {
      authorId: req.params.userId
    }
  })

  // Promise.all is included in ES6! Woo!
  Promise.all([findUser, findPages])
  // could also use bluebird .spread here (see wiki.js for more details)
  .then(function(result) {
    // ES6 syntax, woo!
    const [user, pages] = result;
    res.render('userpages', {
      user: user,
      pages: pages
    })
  })
  .catch(next);
})

module.exports = router;
