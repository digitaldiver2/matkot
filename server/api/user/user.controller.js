'use strict';

import User from './user.model';
import Order from '../order/order.model';
import passport from 'passport';
import config from '../../config/environment';
import jwt from 'jsonwebtoken';
import _ from 'lodash';


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
    // console.dir(entity);
    // console.dir(updates);
    // console.log('====================');
    //clear groups
    entity.groups = new Array();
    //clear orders
    entity.orders = new Array();

    //clear requested groups
    entity.requested_groups = new Array();

    //push all elements from updates

    //remove groups and orders from updates
    // console.log('groups');
    if (updates.groups) {
      updates.groups.forEach(function (group) {
        entity.groups.push(typeof(group) === 'object'? group._id : group);
      });
    }

    if (updates.orders) {
      updates.orders.forEach(function (order_id) {
        entity.orders.push(order_id);
      });
    }

    if (updates.requested_groups) {
      updates.requested_groups.forEach(function (group) {
        entity.requested_groups.push(typeof(group) === 'object'? group._id : group);
      });
    }


    delete updates.groups;
    delete updates.orders;
    delete updates.requested_groups;

    var updated = _.merge(entity, updates);

    return updated.save()
      .then(updated => {
        return User.findById(updated._id, '-salt -password')
          .populate('groups')
          .populate('requested_groups')
          .exec()
      })
      .then(updated => {
        return updated;
      })
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      Order.count({$or: [{creator: entity._id}, {modifier: entity._id}, {owner: entity._id}]}).then (function (count) {
        if (count > 0) {
          res.status(999).send('Unable to remove item because it is used by one or more documents');
        } else {
          // return entity.remove()
          //   .then(() => {
          //     res.status(204).end();
          //   });
          res.status(999).send('Unable to remove item because it is used by one or more documents');
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


function validationError(res, statusCode) {
  statusCode = statusCode || 422;
  return function(err) {
    res.status(statusCode).json(err);
  }
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    console.log(err);
    res.status(statusCode).send(err);
  };
}

/**
 * Get list of users
 * restriction: 'admin'
 */
export function index(req, res) {
  return User.find({}, '-salt -password')
    .populate('groups')
    .populate('requested_groups')
    .exec()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(handleError(res));
}

/**
 * Creates a new user
 */
export function create(req, res, next) {
  var newUser = new User(req.body);
  newUser.provider = 'local';
  newUser.role = 'user';
  newUser.save()
    .then(function(user) {
      var token = jwt.sign({ _id: user._id }, config.secrets.session, {
        expiresIn: 60 * 60 * 5
      });
      res.json({ token });
    })
    .catch(validationError(res));
}

/**
 * Get a single user
 */
export function show(req, res, next) {
  var userId = req.params.id;

  return User.findById(userId)
    .populate('groups')
    .populate('requested_groups')
    .exec()
    .then(user => {
      if (!user) {
        return res.status(404).end();
      }
      res.json(user.profile);
    })
    .catch(err => next(err));
}

export function admin_show(req, res, next) {
  var userId = req.params.id;

  return User.findById(userId, '-salt -password -__v')
    .populate('groups')
    .populate('requested_groups')
    .exec()
    .then(user => {
      if (!user) {
        return res.status(404).end();
      }
      res.json(user);
    })
    .catch(err => next(err));
}

/**
 * Deletes a user
 * restriction: 'admin'
 */
export function destroy(req, res) {
  // return User.findByIdAndRemove(req.params.id).exec()
  //   .then(function() {
  //     res.status(204).end();
  //   })
  //   .catch(handleError(res));

  return User.findById(req.params.id).exec().then(user => {
    Order.count({$or: [{creator: user._id}, {modifier: user._id}, {owner: user._id}]}).then (function (count) {
        if (count > 0) {
          res.status(999).send('Unable to remove item because it is used by one or more documents');
        } else {
          return user.remove()
            .then(() => {
              res.status(204).end();
            });
        }
      });   
  });

}

/**
 * Change a users password
 */
export function changePassword(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  return User.findById(userId).exec()
    .then(user => {
      if (user.authenticate(oldPass)) {
        user.password = newPass;
        return user.save()
          .then(() => {
            res.status(204).end();
          })
          .catch(validationError(res));
      } else {
        return res.status(403).end();
      }
    });
}

/**
 * Admin reset user password
 */
export function adminChangePassword(req, res, next) {
  let userId = req.params.id;
  var password = String(req.body.password);

  return User.findById(userId).exec()
    .then(user => {
        user.password = password;
        return user.save()
          .then(() => {
            res.status(204).end();
          })
          .catch(validationError(res));
    });
}
/**
 * update data
 */

 // Updates an existing user in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return User.findById(req.params.id)
    .exec()
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

/**
 * Get my info
 */
export function me(req, res, next) {
  var userId = req.user._id;

  return User.findOne({ _id: userId }, '-salt -password')
  .populate('groups')
  .populate('requested_groups')
  .exec()
    .then(user => { // don't ever give out the password or salt
      if (!user) {
        return res.status(401).end();
      }
      res.json(user);
    })
    .catch(err => next(err));
}

/**
 * Authentication callback
 */
export function authCallback(req, res, next) {
  res.redirect('/');
}

/**
 * Request password reset code
 */
export function requestReset(req, res, next) {
  var mail = req.params.mail;
  return User.findOne({email: mail}).exec()
    .then(user => {
      if (!user) {
        return res.status(404).end('user not found');
      }
      user.generateResetToken((err, token, token_expire) => {
        if (err) {
          handleError(res);
        } else {
          user.reset_token = token;
          user.token_expire = token_expire;
          user.save()
          .then(() => {
            return res.json({'token': token});
          })
          .catch(validationError(res));
        }
      });
  })
  .catch(err => next(err));
}

/**
 * Reset password
 */
export function reset(req, res, next) {
  var token = req.params.token;
  var password = String(req.body.password);

  return User.findOne({reset_token: token})
    .exec()
    .then(user => {
      if (!user) {
        return res.status(404).end('user not found');
      }
      if (user.token_expire < new Date()) {
        next('token expired');
      } else {
      user.password = password;
      user.reset_token = undefined;
      user.token_expire = undefined;
      user.save().then(() => {
            return res.status(204).end();
          })
          .catch(validationError(res));
      }
  })
  .catch(err => next(err));
}
