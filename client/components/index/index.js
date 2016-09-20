'use strict';
const config = require('./config.json');
const indexModule = angular.module('index', []);
indexModule.config(require('./config.js'));

/**
 * IndexController
 */
class IndexController {
  constructor($element) {
    'ngInject';
    this._$element = $element;
    this.title = config.title;
  }

  onClick() {
    console.log('Index component clicked!');
  }

  $onInit() {
    this._$element.on('click', this.onClick);
  }

  $onDestroy() {
    this._$element.off('click', this.onClick);
  }
};

indexModule.component('indexComponent', {
  templateUrl: 'views/index/index.html',
  controller: IndexController
});

module.exports = indexModule;
