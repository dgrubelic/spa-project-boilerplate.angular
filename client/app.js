'use strict';

// Load only used application components
const indexComponent = require('./components/index');

// Initialize application
const app = angular.module('app', [
  'index'
]);

app.config(require('./config'));
app.run(function () {
  
});