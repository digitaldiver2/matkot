'use strict';

var express = require('express');
var controller = require('./product.controller');
import * as auth from '../../auth/auth.service';

var router = express.Router();

router.get('/', controller.index);
router.get('/public', controller.publicIndex);
router.get('/:id', controller.show);
router.get('/group/:group_id', controller.groupIndex);
router.get('/category/:category_id', controller.categoryIndex);
router.post('/', auth.hasRole('admin'), controller.create);
router.put('/:id', auth.hasRole('admin'), controller.update);
router.patch('/:id', auth.hasRole('admin'), controller.update);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);
router.put('/stockchange/:id/:stock/:reason', auth.hasRole('admin'), controller.stockchange);

module.exports = router;
