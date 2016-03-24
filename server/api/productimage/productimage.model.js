'use strict';

import mongoose from 'mongoose';

var ProductimageSchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean
});

export default mongoose.model('Productimage', ProductimageSchema);
