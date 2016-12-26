'use strict';

import mongoose from 'mongoose';

var MailSchema = new mongoose.Schema({
  to: {type: String, required: true},
  body: {type: String, required: true},
  subject: {type: String, required: true},
  success: {type: Boolean, default: false},
  error: String,
  created: {type: Date, required: true},
  executed: Date
});

export default mongoose.model('Mail', MailSchema);
