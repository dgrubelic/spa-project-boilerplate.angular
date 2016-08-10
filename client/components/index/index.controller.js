'use strict';
const config = require('./config.json');

/**
 * IndexController
 */
module.exports = class IndexController {
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