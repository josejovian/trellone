const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	cardID: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Card'
	},
	content: String
}, { timestamps: true });

const comment = {
	schema: commentSchema,
	model: mongoose.model("Comment", commentSchema)
};

module.exports = comment;
