/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/settingss              ->  index
 * POST    /api/settingss              ->  create
 * GET     /api/settingss/:id          ->  show
 * PUT     /api/settingss/:id          ->  update
 * DELETE  /api/settingss/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import Settings from './settings.model';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function indexRespondWithResult(res, statusCode) {
  console.log('indexRespondWithResult');
  statusCode = statusCode || 200;
  return function(entity) {
    console.log(typeof(entity), entity.length);
    console.dir(entity);
    console.log('-----');
    if (!entity || entity.length != 1) {
      Settings.find().remove().then(() => {
        console.log('create default');
        var defaultsettings = new Settings();
        defaultsettings.save(function (err) {
          if (err) return handleError(err);
          else
            res.status(statusCode).json(defaultsettings);
        });
      });
    }
    else {
      console.log('return existing');
      res.status(statusCode).json(entity[0]);
    }
  };
}

function saveUpdates(updates) {
  return function(entity) {
    var updated = _.merge(entity, updates);
    return updated.save()
      .then(updated => {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
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

// Gets a list of Settingss
export function index(req, res) {
  return Settings.find().exec()
    .then(indexRespondWithResult(res))
    .catch(handleError(res));
}

// // Gets a single Settings from the DB
// export function show(req, res) {
//   return Settings.findById(req.params.id).exec()
//     .then(handleEntityNotFound(res))
//     .then(respondWithResult(res))
//     .catch(handleError(res));
// }

// // Creates a new Settings in the DB
// export function create(req, res) {
//   return Settings.create(req.body)
//     .then(respondWithResult(res, 201))
//     .catch(handleError(res));
// }

// Updates an existing Settings in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return Settings.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// // Deletes a Settings from the DB
// export function destroy(req, res) {
//   return Settings.findById(req.params.id).exec()
//     .then(handleEntityNotFound(res))
//     .then(removeEntity(res))
//     .catch(handleError(res));
// }
