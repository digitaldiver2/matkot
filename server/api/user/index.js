'use strict';

import {Router} from 'express';
import * as controller from './user.controller';
import * as auth from '../../auth/auth.service';

var router = new Router();

// router.get('/', auth.hasRole('admin'), controller.index);
router.get('/', auth.hasRole('admin'), controller.index);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);
router.get('/me', auth.isAuthenticated(), controller.me);
router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);
router.put('/:id/settings', auth.isAuthenticated(), controller.update);
router.put('/admin/:id', auth.isAuthenticated(), controller.update);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.get('/admin/:id', auth.hasRole('admin'), controller.admin_show);
router.get('/requestreset/:mail', controller.requestReset);
router.put('/reset/:token', controller.reset);
router.post('/', controller.create);

module.exports = router;
