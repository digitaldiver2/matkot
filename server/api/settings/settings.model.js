'use strict';

import mongoose from 'mongoose';

var SettingsSchema = new mongoose.Schema({
	orderprefix: {
		type: String,
		default: ''
	},
	ordernumberwidth: {
		type: Number,
		default: 3
	},
	ordercounter: {
		type: Number,
		default: 0
	}
});

export default mongoose.model('Settings', SettingsSchema);
