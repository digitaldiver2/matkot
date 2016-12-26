/**
 * Mail model events
 */

'use strict';

import {EventEmitter} from 'events';
import Mail from './mail.model';
var MailEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
MailEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Mail.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    MailEvents.emit(event + ':' + doc._id, doc);
    MailEvents.emit(event, doc);
  }
}

export default MailEvents;
