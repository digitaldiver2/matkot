'use strict';

import mongoose from 'mongoose';

var ProductSchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean,
  prices: [{price: Number, pricecategory: {type: Number, ref: 'Pricecategory'}}],
  isconsumable: Boolean,
  stock: Number,
  visiblegroups: [{type: number, ref: 'Usergroup'}],
  productfamily: [{type: number, ref: 'Productfamily'}],
  images: [{type: number, ref: 'Productimage'}]
});

export default mongoose.model('Product', ProductSchema);
