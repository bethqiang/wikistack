'use strict'

const express = require('express');
const router = express.Router();
const models = require('../models');
const Page = models.Page;
const User = models.User;

router.get('/', function(req, res, next) {
  Page.findAll({
  })
  .then(function(allPages){
    res.render('index', {
      // title: allPages.title,
      // urlTitle: allPages.urlTitle
      pages: allPages
    });
  })
  .catch(next);
})

router.post('/', function(req, res, next) {
  let name = req.body.name;
  let email = req.body.email;
  let title = req.body.title;
  let content = req.body.content;
  let status = req.body.status;

  User.findOrCreate({
    where:
      {
        name: name,
        email: email
      }
  })
  .then(function(values) {
    let user = values[0];

    let page = Page.build({
      title: title,
      content: content,
      status: status
    });

    return page.save()
    .then(function(addedPage) {
      return addedPage.setAuthor(user);
    }) ;

  })
  .then(function(addedPage) {
    res.redirect(addedPage.route);
  })
  .catch(next);
})

router.get('/add', function(req, res, next) {
  res.render('addpage', {});
})

router.get('/:urlTitle', function(req, res, next) {
  Page.findOne({
    where: {
      urlTitle: req.params.urlTitle
    }
  })
  .then(function(foundPage){
    res.render('wikipage', {
      title: foundPage.title,
      content: foundPage.content,
      date: foundPage.date
    });
  })
  .catch(next);
})

module.exports = router;
