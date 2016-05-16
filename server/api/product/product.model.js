'use strict';

import mongoose from 'mongoose';
import {Schema} from 'mongoose';

var ProductSchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean,
  prices: [{price: Number, pricecategory: {type: Schema.Types.ObjectId, ref: 'Pricecategory'}}],
  defaultprice: Number,
  replacementprice: Number,
  isconsumable: Boolean,
  stock: Number,
  code: String,
  visiblegroups: [{type: Schema.Types.ObjectId, ref: 'Usergroup'}],
  productfamily: [{type: Schema.Types.ObjectId, ref: 'Productfamily'}],
  images: [{type: Schema.Types.ObjectId, ref: 'Productimage'}]
});

export default mongoose.model('Product', ProductSchema);
