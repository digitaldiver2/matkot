/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/products              ->  index
 * POST    /api/products              ->  create
 * GET     /api/products/:id          ->  show
 * PUT     /api/products/:id          ->  update
 * DELETE  /api/products/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import Product from './product.model';
import Order from '../order/order.model';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function saveUpdates(updates) {
  return function(entity) {
    entity.visiblegroups = new Array();
    updates.visiblegroups.forEach(function (group_id) {
      entity.visiblegroups.push(group_id);
    });
    delete updates.visiblegroups;

    entity.productfamily = new Array();
    updates.productfamily.forEach(function (family_id) {
      entity.productfamily.push(family_id);
    });
    delete updates.productfamily;

    entity.prices = new Array();
    updates.prices.forEach(function (object) {
      entity.prices.push(object);
    });
    delete updates.prices;


    var updated = _.merge(entity, updates);
    return updated.save()
      .then(updated => {
        return updated;
      });
  };
}

function saveStockUpdate(stock_cnt, reason, user_id) {
  return function (entity) {
    var today = new Date();
    entity.stock = stock_cnt;
    entity.stock_date = today;
    entity.stock_mod_reason = reason;
    entity.stock_modifier = user_id;

    entity.stock_history.push({
      stock: stock_cnt, 
      stock_date: today,
      stock_mod_reason: reason, 
      stock_modifier: user_id
    });

    return entity.save()
      // .populate('stock_modifier')
      // .populate('stock_history.stock_modifier')
      .then(entity => {
        return entity;
      });

  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      Order.count({products: { $elemMatch: {product: entity._id}}}).then (function (count) {
        if (count > 0) {
          res.status(999).send('Unable to remove item because it is used by one or more documents');
        } else {
          return entity.remove()
            .then(() => {
              res.status(204).end();
            });
        }
      });      
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Products
export function index(req, res) {
  return Product.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a list of Products available for everyone, without pricing
export function publicIndex(req, res) {
  return Product.find({'active': true, visiblegroups: {$exists: true, $size:0}}).exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a list of Products available for group, with pricing
export function groupIndex(req, res) {
  var query = undefined;
  if (req.params.group_id != 0) {
    query = {
      $or:[
        {visiblegroups: req.params.group_id},
        {visiblegroups: {$exists:true, $size:0}},
        {visiblegroups: {$exists: false}}
      ]
    };
  } else {
      query = {
        $or: [
          {visiblegroups: {$exists:true, $size:0}},
          {visiblegroups: {$exists: false}}
        ]
      };
  }

  return Product.find(query).exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

//get list of products for specific productcategory
export function categoryIndex(req, res) {
  var query = undefined;
  if (req.params.group_id != 0) {
    query = {productfamily: req.params.category_id};
  } else {
      query = {};
  }
  return Product.find(query).exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Product from the DB
export function show(req, res) {
  return Product.findById(req.params.id)
    .populate('stock_modifier')
    .populate('stock_history.stock_modifier')
    .exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Product in the DB
export function create(req, res) {
  return Product.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Product in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return Product.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

//change stock
export function stockchange(req, res) {
  var product_id = req.params.id;
  var stock_cnt = req.params.stock;
  var reason = req.params.reason;
  var user_id = req.user._id;

  return Product.findById(product_id)
    .exec()
    .then(handleEntityNotFound(res))
    .then(saveStockUpdate(stock_cnt, reason, user_id))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Product from the DB
export function destroy(req, res) {
  return Product.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
