'use strict';

import mongoose from 'mongoose';

var OrderSchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean,
  comments: [{date: Date, creator: {type: Number, ref: 'User'}, body: String}],
  products: [
	  	{
	  		product: {type: Number, ref: 'Product'},
	  		requested: Number,
	  		received: Number,
	  		returned: Number,
	  		unitprice: Number
		}
	],
  state: String, //Draft/Request/Order/Delivered/Returned/Closed
  creator: {type: Number, ref: 'User'},
  modifier: {type: Number, ref: 'User'},
  creationdate: Date,
  modifieddate: Date,
  group: {type: Number, ref: 'Usergroup'},
  owner: {type: Number, ref: 'User'},
  deliverydate: Date,
  returndate: Date,
  pricecategory: {type: Number, ref: 'Pricecategory'},
  changehistory: [String]

});

export default mongoose.model('Order', OrderSchema);
