/**
 * Productfamily model events
 */

'use strict';

import {EventEmitter} from 'events';
import Productfamily from './productfamily.model';
var ProductfamilyEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ProductfamilyEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Productfamily.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    ProductfamilyEvents.emit(event + ':' + doc._id, doc);
    ProductfamilyEvents.emit(event, doc);
  }
}

export default ProductfamilyEvents;
