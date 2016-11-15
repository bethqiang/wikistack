'use strict'

const express = require('express');
const app = express();
const port = 3000;

const morgan = require('morgan');
const bodyParser = require('body-parser');

const nunjucks = require('nunjucks');

const path = require('path');
module.exports = app;

//required routes
const wikiRouter = require('./routes/wiki');
const userRouter = require('./routes/users');

// set up nunjucks
// have res.render work with html files
app.set('view engine', 'html');
// when giving html files to res.render, tell it to use nunjucks
app.engine('html', nunjucks.render);
// point nunjucks to the directory containing templates and turn off caching
// configure returns an Environment instance, which we'll want to use to add Markdown support later
const env = nunjucks.configure('views', { noCache: true });

// middleware
//logging middleware
app.use(morgan('dev'));
// static middleware
app.use(express.static(path.join(__dirname, './public')));
// body parsing middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// routes
app.use('/wiki', wikiRouter);
// or, in one line: app.use('/wiki', require('./routes/wiki'));
app.use('/users', userRouter);

// models
const models = require('./models');
const Page = models.Page;
const User = models.User;

// basic route, to be deleted and/or moved to routes folder
app.get('/', function(req, res, next) {
  res.send('Hello, world!');
})

// sync models
User.sync()
.then(function() {
  return Page.sync()
})
.then(function() {
  // inside here because we only want the server to start once both of our models have synced
  app.listen(port, function() {
    console.log('Listening on port ' + port);
  })
})
.catch(console.error);

// error handling middleware NEEDS TO HAVE 4 arguments ALWAYS
app.use('/', function(err, req, res, next) {
  console.log(err);
  res.status(500).send(err.message);
})
