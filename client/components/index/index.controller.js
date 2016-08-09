'use strict';
const config = require('./config.json');

/**
 * IndexController
 */
class IndexController {
  constructor() {
    this.title = config.title;
  }
};

module.exports = IndexController;