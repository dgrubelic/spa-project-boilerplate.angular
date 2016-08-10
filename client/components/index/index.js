'use strict';
const indexModule = angular.module('index', []);

indexModule.config(require('./config.js'));
indexModule.controller('IndexComponentController', require('./index.controller'));
indexModule.component('indexComponent', {
  templateUrl: 'views/index/index.html',
  controller: 'IndexComponentController'
});

module.exports = indexModule;