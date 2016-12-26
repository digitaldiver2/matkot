'use strict';

var express = require('express');
var controller = require('./mail.controller');
import * as auth from '../../auth/auth.service';


var router = express.Router();

router.get('/', auth.hasRole('admin'), controller.index);
router.get('/:id', auth.hasRole('admin'), controller.show);
router.post('/', controller.create);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);

module.exports = router;
