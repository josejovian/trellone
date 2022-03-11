const mongoose = require("mongoose");

const boardSchema = new mongoose.Schema({
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	name: String,
	pictureURL: String,
	pictureAuthorName: String,
	pictureAuthorURL: String,
	description: String,
	isPublic: Boolean,
	lists: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'List'
	}],
	members: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}],
	tags: [ String ],
}, { timestamps: true });

const board = {
	schema: boardSchema,
	model: mongoose.model("Board", boardSchema)
}

module.exports = board;
