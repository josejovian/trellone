require("dotenv").config();

const Board = require("../model/Board").model;
const Card = require("../model/Card").model;
const User = require("../model/User").model;
const Comment = require("../model/Comment").model;
const List = require("../model/List").model;
const io = require("../server");
const { exception } = require("./error");
const { hasAccessToBoard } = require("./access");
const ObjectId = require("mongodb").ObjectId;

const funcGetBoard = async (req, res) => {

	return await Board.findOne({ _id: req.params.id })
		.populate("author")
		.populate("members")
		.populate({
			path: "lists.cards",
			populate: [
				{
					path: "comments",
					populate: [{ path: "author" }],
				},
				{
					path: "members",
				},
			],
		})
		.catch((e) => {
			
			
		})
		.then(() => {
			
		});
};

const getAllBoards = async (req, res) => {
	const data = await Board.find().populate("author").populate("members");
	res.send(data);
};

const getAllUsers = async (req, res) => {
	const data = await User.find();
	res.send(data);
};

const getBoard = async (req, res) => {
	try {
		let data = await Board.findOne({ _id: req.params.id })
			.populate("author")
			.populate("members")
			.populate({
				path: "lists",
				populate: [
					{
						path: "cards",
						populate: [
							{
								path: "comments",
								populate: [
									{
										path: "author" 
									}
								],
							},
							{
								path: "members",
							},
							
						],
					},
				],
			});
		res.send(data);
	} catch(e) {
		exception(res);
	}
};

const createBoard = async (req, res) => {
	const {
		id,
		name,
		pictureURL = "",
		pictureAuthorName = "",
		pictureAuthorURL = "",
		isPublic,
	} = req.body;

	try {
		const userBoards = await Board.find({ author: id });

		if(userBoards.length > 2) {
			res.statusMessage = "You cannot have more than 2 boards.";
			res.status(204).send("");
			return;
		}

		const board = new Board({
			author: id,
			name: name,
			pictureURL,
			pictureAuthorName,
			pictureAuthorURL,
			description: "Type the board description here!",
			isPublic,
			cards: 0,
			lists: [],
			members: [],
			tags: [],
		});
		await board.save();

		res.send(board);
	} catch(e) {
		exception(res);
	}
};

const updateBoard = async (req, res) => {
	const {
		id,
		name = null,
		description = null,
		lists = null,
		members = null,
		isPublic = null,
		userID,
	} = req.body;

	try {
		let data = await Board.findOne({ _id: id });

		if(!hasAccessToBoard(userID, data)) {
			res.statusMessage = "You have no permission to edit this board.";
			res.status(204).send("");
			return;
		}

		if (name !== null) data.name = name;
		if (description !== null) data.description = description;
		if (lists !== null) data.lists = lists;
		if (members !== null) data.members = members;
		if (isPublic !== null) data.isPublic = isPublic;

		await data.save();
		res.send(data);

	} catch(e) {
		exception(res);
	}
};

module.exports = {
	getAllBoards,
	getAllUsers,
	getBoard,
	createBoard,
	updateBoard,
	hasAccessToBoard
};