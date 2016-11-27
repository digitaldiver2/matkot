'use strict';

var express = require('express');
var controller = require('./order.controller');
import * as auth from '../../auth/auth.service';

var router = express.Router();

router.get('/', auth.isAuthenticated(), controller.index);
router.get('/user/:id', auth.isAuthenticated(), controller.userindex);
router.get('/group/:id', auth.isAuthenticated(), controller.groupindex);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/query/x', auth.hasRole('admin'), controller.query);
router.get('/overlap/:id', auth.isAuthenticated(), controller.overlaps);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id', auth.isAuthenticated(), controller.update);
router.put('/comment/:id', auth.isAuthenticated(), controller.addComment);
router.patch('/:id', auth.isAuthenticated(), controller.update);
router.delete('/:id', auth.isAuthenticated(), controller.destroy);

module.exports = router;
