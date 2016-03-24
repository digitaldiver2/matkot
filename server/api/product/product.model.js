'use strict';

import mongoose from 'mongoose';

var ProductSchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean,
  prices: [{price: Number, pricecategory: {type: Number, ref: 'Pricecategory'}}],
  isconsumable: Boolean,
  stock: Number,
  visiblegroups: [{type: Number, ref: 'Usergroup'}],
  productfamily: [{type: Number, ref: 'Productfamily'}],
  images: [{type: Number, ref: 'Productimage'}]
});

export default mongoose.model('Product', ProductSchema);
