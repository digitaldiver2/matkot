'use strict';

var express = require('express');
var controller = require('./order.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/user/:id', controller.userindex);
router.get('/group/:id', controller.groupindex);
router.get('/:id', controller.show);
router.get('/overlap/:id', controller.overlaps);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;
