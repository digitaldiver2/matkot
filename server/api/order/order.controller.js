/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/orders              ->  index
 * POST    /api/orders              ->  create
 * GET     /api/orders/:id          ->  show
 * PUT     /api/orders/:id          ->  update
 * DELETE  /api/orders/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import Order from './order.model';
import Usergroup from '../usergroup/usergroup.model';
import config from '../../config/environment';

// for handling mail notifications
import Mail from '../mail/mail.model';
var mailController = require('../mail/mail.controller');


function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function (entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

/* mails to be send on new request/order
1 mail to the administrators to notify there is a new mail
1 mail to the owner of the order
*/
function sendNewRequestMails(order) {
  order.populate('group').populate('owner', { 'name': true, 'email': true, 'phone': true }, function (err) {
    if (err) {
      console.error(err);
    }
    // mail to administrators
    let groupname = order.group ? order.group.name : 'prive';
    let subject = `Nieuwe aanvraag: ${order.name} van ${order.owner.name} (${groupname})`;
    var mail = {
      to: config.adminEmail,
      subject: subject,
      body: `${config.host}/admin/order/${order._id}`
    }
    mailController.sendMail(mail).then(() => {
      console.log('mail sent to administrators');
    });

    // mail to requester
    let subjectClient = `Aanvraag ${order.name} ontvangen`;
    var mail = {
      to: order.owner.email,
      subject: subjectClient,
      body:
        `Beste ${order.owner.name},

wij hebben uw aanvraag goed ontvangen. We zullen u zo snel mogelijk een antwoord sturen.

mvg,
De uitleendienst van de Jeugdraad van Knokke-Heist.

Uw aanvraag: ${config.host}/request/info/${order._id}`
    }
    mailController.sendMail(mail).then(() => {
      console.log('mail sent to client');
    });
  });
}

/* mail to be sent on approved request/order
1 mail to the owner of the order
*/
function sendRequestApprovedMails(order) {
  order.populate('group').populate('owner', { 'name': true, 'email': true, 'phone': true }, function (err) {
    if (err) {
      console.error(err);
    }
    // mail to requester
    var mail = {
      to: order.owner.email,
      subject: `Aanvraag ${order.fulltitle} goedgekeurd`,
      body:
        `Beste ${order.owner.name},

uw aanvraag werd goedgekeurd. U kan op onderstaande link terugvinden welke materialen werden goedgekeurd.
Uw aanvraag: ${config.host}/request/info/${order._id}

mvg,
De uitleendienst van de Jeugdraad van Knokke-Heist.
`
    }
    mailController.sendMail(mail).then(() => {
      console.log('mail send to client');
    });
  });
}

/* mail to be sent on new comment
1 mail to admins and 1 mail to owner
*/
function sendNewCommentMails(order) {
  order
    .populate('comments.creator', 'name')
    .populate('owner', { 'name': true, 'email': true, 'phone': true }, function (err) {
      if (err) {
        console.error(err);
      }

      const lastComment = order.comments[order.comments.length - 1];
      const subject = `Nieuw bericht van ${lastComment.creator.name} in ${order.fulltitle}`
      const body = `"""
  ${lastComment.body}
"""
 - ${lastComment.creator.name}
 `
      let admin_url = `${config.host}/admin/order/${order._id}`;
      let client_url = `${config.host}/request/info/${order._id}`;

      // mail to client 
      var mail = {
        to: order.owner.email,
        subject: subject,
        body: body + client_url
      };

      mailController.sendMail(mail).then(() => {
        console.log('mail send to client');
      });
      // mail to admin 
      var mail = {
        to: config.adminEmail,
        subject: subject,
        body: body + admin_url
      };

      mailController.sendMail(mail).then(() => {
        console.log('mail send to client');
      });
    });
}


function getOverlappingOrders(res, statusCode) {
  return function (entity) {
    if (entity) {
      statusCode = statusCode || 200;
      Order.find({
        $or: [
          {
            'pickupdate': { $gte: entity.pickupdate, $lt: entity.returndate }
          },
          {
            'pickupdate': { $lt: entity.pickupdate },
            'returndate': { $gt: entity.pickupdate }
          }],
        '_id': { $ne: entity._id }
      }).exec().then(data => {
        res.status(statusCode).json(data);
      });
    }
  };
}

function saveUpdates(updates, postSave) {
  console.log('saving updates');

  return function (entity) {
    entity.products = new Array();
    updates.products.forEach(function (product) {
      entity.products.push(product);
    });
    delete updates.products;

    if (updates.shortages != undefined) {
      entity.shortages = new Array();
      updates.shortages.forEach(function (product) {
        entity.shortages.push(product);
      });
      delete updates.shortages;
    }
    if (typeof (updates.group) == 'object') {
      updates.group = updates.group._id;
    }
    if (typeof (updates.owner) == 'object') {
      updates.owner = updates.owner._id;
    }

    var updated = _.merge(entity, updates);
    return updated.save()
      .then(updated => {
        if (postSave != null) {
          postSave(updated);
        }
        // return updated;
        return Order.findById(updated._id)
          .populate('group', { 'name': true })
          .populate('owner', { 'name': true, 'email': true, 'phone': true })
          .populate('products.product')
          .populate('comments.creator', 'name');
      });
  };
}

function addCommentToOrder(req, postSave) {
  return function (entity) {
    var now = new Date();
    entity.comments.push({ creator: req.user._id, body: req.body.body, date: now });
    return entity.save()
      .then(updated => {
        if (postSave != null) {
          postSave(updated);
        }
        return updated;
      });
  }
}

//'dont remove entity if state is not draft or if an ordernumber is available
function removeEntity(res) {
  return function (entity) {
    if (entity && entity.state == 'DRAFT' && entity.ordernumber == undefined) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    } else {
      console.error('unable to remove order because state was not draft or ordernumber already assigned');
      res.status(999).send('Aanvraag kant niet verwijderd worden omdat ze geen concept is of omdat ze al een ordernummer heeft.');
    }
  };
}

function handleEntityNotFound(res) {
  return function (entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function (err) {
    console.log(err);
    res.status(statusCode).send(err);
  };
}

// Gets a list of Orders
export function index(req, res) {
  if (req.user.role === 'admin') {
    return Order.find()
      .populate('group', { 'name': true })
      .populate('owner', { 'name': true, 'email': true, 'phone': true })
      .populate('products.product')
      .populate('comments.creator', 'name')
      .exec()
      .then(respondWithResult(res))
      .catch(handleError(res));
  } else {
    console.log(req.user._id);
    let query = {
      $or: [
        {owner: req.user._id},
      ]
    };
    req.user.groups.forEach(groupid => {
      query['$or'].push({group: groupid});
    });
    return Order.find(query)
      .populate('group', { 'name': true })
      .populate('owner', { 'name': true, 'email': true, 'phone': true })
      .populate('products.product')
      .populate('comments.creator', 'name')
      .exec()
      .then(respondWithResult(res))
      .catch(handleError(res));
  }
}

// Gets a list of Orders for user
export function userindex(req, res) {
  var userid = req.params.id;

  return Order.find({ creator: userid })
    .populate('group')
    .populate('owner', { 'name': true, 'email': true, 'phone': true })
    .populate('products.product')
    .populate('comments.creator', 'name')
    .exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a list of Orders for group
export function groupindex(req, res) {
  var groupid = req.params.id;
  return Order.find({ group: groupid })
    .populate('group')
    .populate('owner', { 'name': true, 'email': true, 'phone': true })
    .populate('products.product')
    .populate('comments.creator', 'name')
    .exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Order from the DB
export function show(req, res) {
  return Order.findById(req.params.id)
    .populate('group')
    .populate('products.product')
    .populate('shortages.product')
    .populate('owner', { 'name': true, 'email': true, 'phone': true })
    .populate('comments.creator', 'name')
    .exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}


export function overlaps(req, res) {
  return Order.findById(req.params.id)
    .exec()
    .then(handleEntityNotFound(res))
    .then(getOverlappingOrders(res))
    .catch(handleError(res));
}

export function query(req, res) {
  return Order.find(req.body.query, req.body.fields)
    .exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}


// Creates a new Order in the DB
export function create(req, res) {
  return Order.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Order in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return Order.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Specific function for requesting order
// same as updating but also sending specific mail
export function request(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return Order.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body, sendNewRequestMails))
    .then(respondWithResult(res))
    .catch(handleError(res));

}

// Specific function for approving order
// same as updating but also sending specific mail
export function approve(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return Order.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body, sendRequestApprovedMails))
    .then(respondWithResult(res))
    .catch(handleError(res));

}
// Updates an existing Order in the DB
export function addComment(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }

  return Order.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(addCommentToOrder(req, sendNewCommentMails))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Order from the DB
// restrictions: it's only possible 
export function destroy(req, res) {
  return Order.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
