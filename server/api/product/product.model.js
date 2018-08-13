  'use strict';

import mongoose from 'mongoose';
import {Schema} from 'mongoose';

var ProductSchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean,
  prices: [{price: Number, pricecategory: {type: Schema.Types.ObjectId, ref: 'Pricecategory'}}],
  defaultprice: {
    type: Number,
    default: 0.0
  },
  replacementprice: {type:Number, default: 0.0},
  isconsumable: Boolean,
  stock: Number,
  stock_date: Date,
  stock_modifier: {type: Schema.Types.ObjectId, ref: 'User'}, //TODO add this as dependency for deleting users
  stock_mod_reason: String,
  stock_history: [{stock: Number, stock_date: Date, stock_modifier: {type: Schema.Types.ObjectId, ref: 'User'}, stock_mod_reason: String}],
  code: String,
  visiblegroups: [{type: Schema.Types.ObjectId, ref: 'Usergroup'}],
  productfamily: [{type: Schema.Types.ObjectId, ref: 'Productfamily'}],
  images: [{type: Schema.Types.ObjectId, ref: 'Productimage'}]
});

export default mongoose.model('Product', ProductSchema);
