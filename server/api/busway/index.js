'use strict';

console.log ('index');

var express = require('express');
var controller = require('./busway.controller');

var router = express.Router();

router.get('/', controller.index);

module.exports = router;
