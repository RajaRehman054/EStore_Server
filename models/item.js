var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Item = new Schema({
	id: Number,
	title: String,
	price: Number,
	description: String,
	category: String,
	image: String,
	rating: {
		rate: {
			type: Number,
		},
		count: {
			type: Number,
		},
	},
});

module.exports = mongoose.model('Item', Item);
