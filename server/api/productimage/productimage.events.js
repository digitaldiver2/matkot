/**
 * Productimage model events
 */

'use strict';

import {EventEmitter} from 'events';
import Productimage from './productimage.model';
var ProductimageEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ProductimageEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Productimage.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    ProductimageEvents.emit(event + ':' + doc._id, doc);
    ProductimageEvents.emit(event, doc);
  }
}

export default ProductimageEvents;
