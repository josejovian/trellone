require("dotenv").config();

const Board = require("../model/Board").model;
const Card = require("../model/Card").model;
const User = require("../model/User").model;
const Comment = require("../model/Comment").model;
const List = require("../model/List").model;
const io = require("../server");
const { isAdminOfBoard, isMemberOfBoard, hasAccessToBoard, denyAccess } = require("./access");

const { exception } = require("./error");

const ObjectId = require("mongodb").ObjectId;

const getList = async (req, res) => {
	try {
		let data = await List.findOne({ _id: req.params.id })
			.populate("cards")
			.catch((e) => {
			});

		if (data === undefined) {
			res.sendStatus(204);
		} else {
			res.send(data);
		}
	} catch(e) {
		exception(res);
	}
};

const createList = async (req, res) => {
	const { boardID, userID } = req.body;

	try {
		const board = await Board.findOne({ _id: boardID });

		if(denyAccess(userID, board, 1, res))
			return;

		if(board.lists.length >= 5) {
			res.statusMessage = "You cannot have more than 5 lists in one board.";
			res.status(204).send("");
			return;
		}

		const list = new List({
			name: "Untitled List",
			boardID: boardID,
			cards: [],
		});
		await list.save();

		board.lists.push(list._id);
		await board.save();

		res.send(list._id);
	} catch(e) {
		exception(res);
	}
};

const updateList = async (req, res) => {
	const { name, userID } = req.body;

	try {
		let list = await List.findOne({ _id: req.params.id });
		let board = await Board.findOne({ _id: list.boardID });

		if(denyAccess(userID, board, 1, res))
			return;

		list.name = name.name;
		await list.save();
		res.send(list);
	} catch(e) {
		exception(res);
	}
};

const deleteList = async (req, res) => {
	try {
		let list = await List.findOne({ _id: req.params.id });
		let board = await Board.findOne({ _id: list.boardID });

		if(board.lists.length === 1) {
			res.statusMessage = "You cannot have less than 1 list in one board.";
			res.status(204).send("");
			return;
		}

		let cards = await Card.find({ listID: list._id });
		cards.forEach(async (card) => {
			await Comment.deleteMany({ cardID: card._id });
		});

		await Card.deleteMany({ listID: list._id });

		const boardLists = board.lists;
		board.lists = boardLists.filter((value) => {
			return String(value) !== String(list._id)
		});

		board.cards -= cards.length;

		await board.save();
		await List.deleteOne({ _id: list._id });
		
		res.send({
			board: board._id, 
			list: list._id
		});
	} catch (e) {
		exception(res);
	}
};

const getAllCards = async (req, res) => {
	try {
		const data = await Card.find().populate("author").populate("members");
		res.send(data);
	} catch(e) {
		exception(res);
	}
};

const createCard = async (req, res) => {
	const { listID, userID } = req.body;

	try {
		let list = await List.findOne({ _id: listID });
		const board = await Board.findOne({_id: list.boardID});

		if(board.cards >= 20) {
			res.statusMessage = "You cannot have more than 20 cards in one board.";
			res.status(204).send("");
			return;
		}

		if(denyAccess(userID, board, 1, res))
			return;

		const card = new Card({
			name: "Untitled Card",
			listID: listID,
			pictureURL: "",
			pictureAuthorName: "",
			pictureAuthorURL: "",
			description: "Type description here!",
			tags: [],
			attachments: [],
			members: [],
			comments: [],
		});

		list.cards.push(card._id);

		board.cards++;
		await card.save();
		await list.save();
		await board.save();

		res.send(card._id);

	} catch(e) {
		exception(res);
	}
};

const updateCard = async (req, res) => {
	const {
		name = null,
		description = null,
		members = null,
		tags = null,
		picture = null,
		attachments = null,
		userID
	} = req.body;

	try {
		const id = req.params.id;

		let card = await Card.findOne({ _id: id });
		let list = await List.findOne({ _id: card.listID });
		let board = await Board.findOne({ _id: list.boardID });

		if(denyAccess(userID, board, 1, res))
			return;

		if (name !== null) card.name = name;
		if (description !== null) card.description = description;
		if (members !== null) card.members = members;
		if (tags !== null) card.tags = tags;
		if (attachments !== null) card.attachments = attachments;
	
		if (picture !== null) {
			card.pictureURL = picture.pictureURL;
			card.pictureAuthorURL = picture.pictureAuthorURL;
			card.pictureAuthorName = picture.pictureAuthorName;
		}

		await card.save();
		res.send(card);

	} catch(e) {
		exception(res);
	}
};

const deleteCard = async (req, res) => {
	try {
		const id = req.params.id;
		let userID = req.body.userID;

		let data = await Card.findOne({ _id: id });
		let list = await List.findOne({ _id: data.listID });
		let board = await Board.findOne({ _id: list.boardID });

		if(denyAccess(userID, board, 1, res))
			return;

		board.cards--;
		list.cards = list.cards.filter((card) => {
			return String(card._id) !== String(id);
		})

		await list.save();
		await Comment.deleteMany({ cardID: id });
		await board.save();
		await Card.deleteOne({ cardID: id });

		res.send(data);
	} catch(e) {
		exception(res);
	}
};

const switchCard = async (req, res) => {
	try {
		let from = req.body.from;
		let _to = req.body.to;
		let { userID, boardID } = req.body;

		let listFrom = await List.findOne({ _id: from.listID });
		let listTo = await List.findOne({ _id: _to.listID });
		let board = await Board.findOne({ _id: boardID });

		if(denyAccess(userID, board, 1, res))
			return;

		function sameList() {
			return String(from.listID) === String(_to.listID);
		}

		const movedCard = await Card.findOne({ _id: from.cardID });
		
		function removeFromList(dbList) {
			dbList.cards = dbList.cards.filter((card, index) => {
				return String(card) !== String(from.cardID)
			});
		}

		function addToList(dbList) {
			dbList.cards.splice(((_to.cardIndex) + 0.5), 0, movedCard._id);
		}

		let count = 0;
		if(sameList()) {
			if(from.cardIndex < _to.cardIndex) {
				_to.cardIndex -= 1;
			}
			removeFromList(listFrom);
			addToList(listFrom);
		} else {
			removeFromList(listFrom);
			addToList(listTo);
			await listTo.save();
			count++;
		}
		await listFrom.save();
		movedCard.listID = listTo._id;
		await movedCard.save();
		
		res.send(movedCard);
	} catch(e) {
		exception(res);
	}
};


const createComment = async (req, res) => {
	const { id, cardID, userID, content } = req.body;

	try {
		let data = await Card.findOne({ _id: id });
		let list = await List.findOne({ _id: data.listID });
		let board = await Board.findOne({ _id: list.boardID });

		if(denyAccess(userID, board, 1, res))
			return;

		const comment = new Comment({
			author: userID,
			cardID: id,
			content: content
		});
		await comment.save();

		data.comments.push(comment._id);
		await data.save();

		const populated = await Comment.findOne({_id: comment._id}).populate("author");
		res.send({
			boardID: list.boardID,
			listID: data.listID,
			cardID: id,
			comment: populated
		});
	} catch(e) {
		exception(res);
	}
}

const updateComment = async (req, res) => {
	try {
		const { content, userID } = req.body;

		let comment = await Comment.findOne({ _id: req.params.id });
		let card = await Card.findOne({ _id: comment.cardID });
		let list = await List.findOne({ _id: card.listID });
		let board = await Board.findOne({ _id: list.boardID });

		if(denyAccess(userID, board, 1, res))
			return;

		comment.content = content;
		await comment.save();
		
		res.send({
			boardID: list.boardID,
			listID: card.listID,
			cardID: comment.cardID,
			comment: comment
		});
	} catch(e) {

	}
}

const deleteComment = async (req, res) => {
	try {
		let comment = await Comment.findOne({ _id: req.params.id });
		let card = await Card.findOne({ _id: comment.cardID });
		let list = await List.findOne({ _id: card.listID });
		let board = await Board.findOne({ _id: list.boardID });

		const cardComments = card.comments;

		card.comments = cardComments.filter((value) => {
			return String(value) !== String(req.params.id)
		});

		await card.save();
		await Comment.deleteOne({ _id: req.params.id });

		res.send({
			boardID: list.boardID,
			listID: card.listID,
			cardID: comment.cardID,
			commentID: req.params.id
		});
	} catch(e) {
		exception(res);
	}
}

const addMember = async (req, res) => {
	const { type, id, memberID, userID } = req.body;

	try {
		let object, list, board, hasAccess = false;
		if(type === "card") {
			object = await Card.findOne({ _id: id }).populate("members");
			list = await List.findOne({ _id: object.listID });
			board = await Board.findOne({ _id: list.boardID });
		} else {
			object = await Board.findOne({ _id: id }).populate("members");
			board = object;
		}

		let result = object.members.concat((type === "board") ? [ object.author ] : []).filter((member) => {
			return String(member._id) === String(memberID);
		}).length;

		if(denyAccess(userID, board, 1, res))
			return;
		
		if(result > 0) {
			res.statusMessage = "That person is already a member.";
			res.status(204).send("");
			return;
		}
		
		object.members.push(memberID);

		let member = await User.findOne({ _id: memberID });

		await object.save();

		if(type === "card") {
			res.send({
				cardID: id,
				listID: object.cardID,
				member,
			});
		} else {
			res.send(member);
		}
	} catch(e) {
		exception(res);
	}
}

const removeMember = async (req, res) => {
	const { type, id, memberID, userID } = req.body;

	try {
		let object, list, board, hasAccess;
		if(type === "card") {
			object = await Card.findOne({ _id: id });
			list = await List.findOne({ _id: object.listID });
			board = await Board.findOne({ _id: list.boardID });
		} else {
			object = await Board.findOne({ _id: id });
			board = object;
		}

		if(denyAccess(userID, board, 2, res))
			return;

		let result = object.members.filter((member) => {
			return String(member._id) !== String(memberID);
		});

		object.members = result;
		
		await object.save();

		if(type === "card") {
			res.send({
				cardID: id,
				listID: object.cardID,
				memberID,
			});
		} else {
			res.send(memberID);
		}
	} catch(e) {
		exception(res);
	}
}

module.exports = {
	getList,
	createList,
	deleteList,
	updateList,
	getAllCards,
	createCard,
	updateCard,
	deleteCard,
	switchCard,
	createComment,
	updateComment,
	deleteComment,
	addMember,
	removeMember,
};