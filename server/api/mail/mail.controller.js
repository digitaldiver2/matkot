/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/mail              ->  index
 * POST    /api/mail              ->  create
 * GET     /api/mail/:id          ->  show
 * PUT     /api/mail/:id          ->  update
 * DELETE  /api/mail/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import Mail from './mail.model';

import nodemailer from 'nodemailer';
import smtpTransport from 'nodemailer-smtp-transport';

var mail_user =  'noreply.materiaalkot@jkh.be'
//note: the user on jkh.be needs a mailbox, otherwise you can't login

var transporter = nodemailer.createTransport(smtpTransport({
    host: 'mail.jkh.be',
    port: 465,
    secureConnection: false,
    debug: true,
    auth: {
        user: mail_user,
        pass: 'Veelteweinigbakfrigos!'
    },
    tls: {
        //ciphers: 'SSLv3'
        rejectUnauthorized: false
    },
    debug: true,
    secure: true,
    ignoreTLS: true
}));

function sendMailAndRespond(res, statusCode) {
  statusCode = statusCode || 200;
  return function (entity) {
    transporter.sendMail({
        from: mail_user,
        to: entity.to,
        subject: entity.subject,
        text: entity.body
    }, function(err, data) {
        if (err) {
          entity.error = err;
          statusCode = 500;
          entity.save().then (()=> {
            res.status(statusCode).json(err);
          });
        } else {
          entity.success = true;
          entity.executed = new Date();
          entity.save().then (()=> {
            res.status(statusCode).json(entity);
          });
        }
        
    });
  }
}


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

// Gets a list of Mails
export function index(req, res) {
  return Mail.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Mail from the DB
export function show(req, res) {
  return Mail.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Mail in the DB
export function create(req, res) {
  var data = req.body;
  data['created'] = new Date();
  console.dir(data);
  return Mail.create(req.body)
    .then(sendMailAndRespond(res, 201))
    .catch(handleError(res));
}

// Updates an existing Mail in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return Mail.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Mail from the DB
export function destroy(req, res) {
  return Mail.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
