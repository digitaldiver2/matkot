/**
 * Main application routes
 */

'use strict';

import errors from './components/errors';
import path from 'path';

export default function(app) {
  // Insert routes below
  app.use('/api/settings', require('./api/settings'));
  app.use('/api/pricecategories', require('./api/pricecategory'));
  app.use('/api/productimages', require('./api/productimage'));
  app.use('/api/productfamilies', require('./api/productfamily'));
  app.use('/api/orders', require('./api/order'));
  app.use('/api/products', require('./api/product'));
  app.use('/api/usergroups', require('./api/usergroup'));
  app.use('/api/things', require('./api/thing'));
  app.use('/api/users', require('./api/user'));
  app.use('/api/mail', require('./api/mail'));

  app.use('/auth', require('./auth').default);

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get((req, res) => {
      res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });
}
