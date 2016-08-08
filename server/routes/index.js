'use strict';
var Router = require('express').Router();
module.exports = Router;

Router.get('/', require('../controllers/index/index.js'));