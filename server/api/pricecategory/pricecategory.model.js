'use strict';

import mongoose from 'mongoose';

var PricecategorySchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean
});

export default mongoose.model('Pricecategory', PricecategorySchema);
