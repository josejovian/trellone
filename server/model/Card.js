const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
	name: String,
	listID: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'List'
	},
	pictureURL: {
		type: String,
		default: ""
	},
	pictureAuthorName: String,
	pictureAuthorURL: String,
	description: String,
	tags: [ String ],
	attachments: [ String ],
	members: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}],
	comments: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Comment'
	}],
}, { timestamps: true });

const card = {
	schema: cardSchema,
	model: mongoose.model("Card", cardSchema)
};

module.exports = card;
