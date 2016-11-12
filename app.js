const express = require('express');
const app = express();
const port = 3000;
const nunjucks = require('nunjucks');
const routes = require('./routes/');
const bodyParser = require('body-parser');
const morgan = require('morgan');


app.use(morgan('combined'));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// set up nunjucks
const env = nunjucks.configure('views', { noCache: true });
app.set('view engine', 'html'); // have res.render work with html files
app.engine('html', nunjucks.render); // when giving html files to res.render, tell it to use nunjucks


// basic route, to be deleted and/or moved to routes folder
app.get('/', function(req, res) {
  res.send("Hello, world!")
});


// start server
const server = app.listen(port, function() {
  console.log('Server listening on port ' + port);
});