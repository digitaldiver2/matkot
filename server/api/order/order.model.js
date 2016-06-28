'use strict';

import mongoose from 'mongoose';

var OrderSchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean,
  comments: [{date: Date, creator: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}, body: String}],
  products: [
	  	{
	  		product: {type: mongoose.Schema.Types.ObjectId, ref: 'Product'},
	  		ordered: Number,
        approved: Number,
	  		received: Number,
	  		returned: Number,
	  		unitprice: Number
		}
	],
  state: {type:String, enum: ['DRAFT', 'ORDERED', 'APPROVED', 'DELIVERED','SHORTAGE', 'CLOSED'], default: 'DRAFT'}, //Draft/Request/Order/Delivered/Returned/Closed
  creator: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  modifier: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  creationdate: Date,
  modifieddate: Date,
  group: {type: mongoose.Schema.Types.ObjectId, ref: 'Usergroup'},
  owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  eventstart: Date,
  eventstop: Date,
  pickupdate: Date,
  returndate: Date,
  pricecategory: {type: mongoose.Schema.Types.ObjectId, ref: 'Pricecategory'},
  changehistory: [String]

});

export default mongoose.model('Order', OrderSchema);
