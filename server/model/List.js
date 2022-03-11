const mongoose = require("mongoose");

const cardSchema = require("./Card").schema;

const listSchema = new mongoose.Schema({
	name: String,
	boardID: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Board'
	},
	cards: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Card'
	}]
});

const list = {
	schema: listSchema,
	model: mongoose.model("List", listSchema),
};


module.exports = list;
