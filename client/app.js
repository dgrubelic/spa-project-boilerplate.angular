'use strict';

// Load only used application components
const indexComponent = require('./components/index');

// Initialize application
const app = angular.module('app', [
  // resources
  'ui.router',

  // modules
  'index'
]);

app.config(function ($urlRouterProvider, $locationProvider) {
  'ngInject';
  $urlRouterProvider.otherwise('/');
  $locationProvider.html5Mode(true);
});

app.run(function () {
  'ngInject';
});