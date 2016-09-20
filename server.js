const express = require('express');
const expressSpa = require('express-history-api-fallback');
const debug = require('debug')('app:server');
const config = require('config');
const path = require('path');

// Create application instance
const app = express();

// middleware
if (config.get('app.debug')) {
  debug('Starting livereload server at port ' + config.get('app.livereload.port'));
  app.use(require('connect-livereload')({
    port: config.get('app.livereload.port')
  }));
}

app.use(express.static(path.join(__dirname, 'public')));
app.use(expressSpa('index.html', { root: path.join(__dirname, 'public') }))
app.use(function (err, req, res, next) {
  console.error(err);
  next(err);
});

// Start server
const server = app.listen(process.env.PORT || config.get('app.port'), function () {
  debug('Started application server at port ' + (process.env.PORT || config.get('app.port')));
});

process.on('exit', function() {
  server.close();
});

module.exports = app;
