const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	githubID: String,
	name: String,
	pictureURL: String,
});

const user = {
	schema: userSchema,
	model: mongoose.model("User", userSchema),
};

module.exports = user;
