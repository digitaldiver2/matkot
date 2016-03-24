'use strict';

import mongoose from 'mongoose';

var UsergroupSchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean
});

export default mongoose.model('Usergroup', UsergroupSchema);
