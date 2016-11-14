const express = require('express');
const app = express();
const port = 3000;
const nunjucks = require('nunjucks');
const wikiRoutes = require('./routes/wiki');
const UserRoutes = require('./routes/users');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const models = require('./models');

app.use(morgan('combined'));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/wiki', wikiRoutes);
app.use('/users', UserRoutes);

// set up nunjucks
const env = nunjucks.configure('views', { noCache: true });
app.set('view engine', 'html'); // have res.render work with html files
app.engine('html', nunjucks.render); // when giving html files to res.render, tell it to use nunjucks

// basic route, to be deleted and/or moved to routes folder
// app.get('/', function(req, res) {
//   res.send("Hello, world!")
// });

models.User.sync({})
.then(function () {
  return models.Page.sync({})
})
.then(function () {
  app.listen(port, function () {
    console.log('Server listening on port ' + port);
  });
})
.catch(console.error);

app.use('/', function(err, req, res, next) {
  console.error(err);
})
