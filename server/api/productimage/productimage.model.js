'use strict';

import mongoose from 'mongoose';

var ProductimageSchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean,
  url: String
});

export default mongoose.model('Productimage', ProductimageSchema);
