'use strict';

var express = require('express');
var controller = require('./settings.controller');
import * as auth from '../../auth/auth.service';

var router = express.Router();

router.get('/', auth.hasRole('admin'), controller.index);
// router.get('/:id', controller.show);
// router.post('/', controller.create);
router.put('/:id', auth.hasRole('admin'), controller.update);
// router.patch('/:id', controller.update);
// router.delete('/:id', controller.destroy);

module.exports = router;
