'use strict';

var express = require('express');
var controller = require('./order.controller');
import * as auth from '../../auth/auth.service';

var router = express.Router();

router.get('/', controller.index);
router.get('/user/:id', controller.userindex);
router.get('/group/:id', controller.groupindex);
router.get('/:id', controller.show);
router.get('/overlap/:id', controller.overlaps);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.put('/comment/:id', auth.isAuthenticated(), controller.addComment);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;
