'use strict'

const express = require('express');
const router = express.Router();

const models = require('../models');
const Page = models.Page;
const User = models.User;

// one of many golden rules: anything that interacts with the database will be asynchronous
// Page.build && page.save() -> take this instance out of the model in my JS program and put the info for the instance in the database
// will return with a promise
// same as doing Page.create

router.get('/', function(req, res, next) {
  Page.findAll({})
  .then(function(pages) {
    res.render('index', {
      pages: pages
    })
  })
  // ALWAYS HANDLE ERRORS!
  .catch(next);
  // same as .catch(function(err) {next(err)})
})

router.post('/', function(req, res, next) {

  const name = req.body.name;
  const email = req.body.email;
  const title = req.body.title;
  const content = req.body.content;
  const status = req.body.status;
  const tags = req.body.tags;

  // findOrCreate - if the name & email already exists, we'll resolve to that user
  // if it does find it, it'll create a new user and give us that back
  User.findOrCreate({
    where: {
      name: name,
      email: email
    }
  })
  // can use .spread here - Bluebird function creates a value for each element in the array, so can separate parameters
  // so instead of having let user = values[0], can do .spread(function(user, wasCreatedBool) {})
  .then(function(values) { // two values: [page that was found or created, created Boolean whether it was created or not]
    const user = values[0]; // wouldn't need this if used .spread, could just use 'user'
    return Page.create({
      // you can just pass in req.body here instead of listing them out individually
      title: title,
      content: content,
      status: status,
      tags: tags
    })
    .then(function(addedPage) {
      // takes id of the user & puts it as authorId of the page
      return addedPage.setAuthor(user);
    })
  })
  .then(function(addedPage) {
    res.redirect(addedPage.route);
  })
  .catch(next);
})

router.get('/add', function(req, res, next) {
  res.render('addpage');
})

// /add needs to be above /:urlTitle
// every time we go to /add, JS will think that add is the urlTitle
// & will try to send back an article called 'add'
// this also means we can't actually have a page called add
router.get('/:urlTitle', function(req, res, next) {
  Page.findOne({
    where: {
      urlTitle: req.params.urlTitle
    },
    // "outer join" of user table on User.id & Page.authorId
    // everything on User will now be available under the property "author"
    // ex. page.author.name = User.name
    include: [
      {model: User, as: 'author'}
    ]
  })
  .then(function(page) {
    if (page === null) {
      return next(new Error('That page was not found!'));
    }
    res.render('wikipage', {
      page: page
    });
  })
  .catch(next);
})

module.exports = router;
