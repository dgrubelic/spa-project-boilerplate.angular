'use strict';
const Router = require('./router');

module.exports = function (app) {
  // Middlewares
  app.use(require('./middlewares/locals.js'));

  // Initialize routers
  Router(app);
};