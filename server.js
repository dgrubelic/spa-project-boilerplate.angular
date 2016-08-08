const express = require('express');
const debug = require('debug')('app:server');
const config = require('config');
const path = require('path');
const ejs = require('ejs');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

// Create application instance
const app = express();

// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

if (config.has('app.livereload.port')) {
  debug('Starting livereload server at port ' + config.get('app.livereload.port'));
  app.use(require('connect-livereload')({
    port: config.get('app.livereload.port')
  }));
}
app.use(express.static(path.join(__dirname, 'public')));

// view engine setup
app.set('views', path.join(__dirname, 'server/views'));
app.set('view engine', 'html');
app.engine('html', ejs.renderFile);

// Error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Start server
app.listen(process.env.PORT || config.get('app.port'), function () {
  debug('Started application server at port ' + (process.env.PORT || config.get('app.port')));
});

// Initialize application 
require('./server/app.js')(app);

module.exports = app;