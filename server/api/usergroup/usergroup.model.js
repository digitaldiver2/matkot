'use strict';

import mongoose from 'mongoose';

var UsergroupSchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean,
  pricecategory: {type: mongoose.Schema.Types.ObjectId, ref: 'Pricecategory'}
});

export default mongoose.model('Usergroup', UsergroupSchema);
