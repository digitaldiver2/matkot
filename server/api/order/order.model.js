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
	  		ordered: {type: Number, default: 0},
        approved: {type: Number, default: 0},
	  		received: {type: Number, default: 0},
	  		returned: {type: Number, default: 0},
	  		unitprice: {type: Number, default: 0},
        comment: {type: String}
		}
	],
  state: {type:String, enum: ['DRAFT', 'ORDERED', 'APPROVED', 'DELIVERED','SHORTAGE', 'CLOSED', 'CANCELLED'], default: 'DRAFT'}, //Draft/Request/Order/Delivered/Returned/Closed
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
  changehistory: [String],
  ordernumber: String,
  totalpaid: {type: Number, default: 0}

});

export default mongoose.model('Order', OrderSchema);
