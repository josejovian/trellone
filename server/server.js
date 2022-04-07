const express = require("express");
const cors = require("cors");
require("dotenv").config({ path: "./.env" });

const mongoose = require("mongoose");
const port = process.env.PORT || 5000;
const db = mongoose.connect(process.env.ATLAS_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true,
	useFindAndModify: false,
});

const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

const Card = require("./model/Card").model;
const Board = require("./model/Board").model;
const List = require("./model/List").model;

app.use(cors());
app.use(express.json());
app.use(require("./route"));

async function getBoardFromID(_id) {
	return await Board.findOne({ _id })
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
									path: "author",
								},
							],
						},
						{
							path: "members",
						},
					],
				},
			],
		});
}

io.on("connection", async (socket) => {
	socket.on("board_subscribe", ({ id }) => {
		socket.join(String(id));
	});

	socket.on("switch_update", async ({ from, to }) => {
		const _list = await List.findOne({ _id: from.listID });

		io.in(String(_list.boardID)).emit("switch_update", { from, to });
	});
	
	socket.on("card_new", async (id) => {
		const _card = await Card.findOne({ _id: id });
		const _list = await List.findOne({ _id: _card.listID });

		io.in(String(_list.boardID)).emit("card_new", _card);
	});

	socket.on("card_delete", async (id) => {
		const _card = await Card.findOne({ _id: id });
		const _list = await List.findOne({ _id: _card.listID });
		
		io.in(String(_list.boardID)).emit("card_delete", _card);
	});

	socket.on("list_new", async (id) => {
		const _list = await List.findOne({ _id: id });

		io.in(String(_list.boardID)).emit("list_new", _list);
	});

	socket.on("list_delete", async ({ board, list }) => {
		io.in(String(board)).emit("list_delete", list);
	});

	socket.on("comment_new", async (data) => {
		io.in(String(data.boardID)).emit("comment_new", data);
	});

	socket.on("comment_update", async (data) => {
		io.in(String(data.boardID)).emit("comment_update", data);
	});

	socket.on("comment_delete", async (data) => {
		io.in(String(data.boardID)).emit("comment_delete", data);
	});

	socket.on("attachment_new", async (data) => {
		io.in(String(data.boardID)).emit("attachment_new", data);
	});

	socket.on("attachment_delete", async (data) => {
		io.in(String(data.boardID)).emit("attachment_delete", data);
	});

	socket.on("member_new", async (data) => {
		io.in(String(data.boardID)).emit("member_new", data);
	});

	socket.on("member_delete", async (data) => {
		io.in(String(data.boardID)).emit("member_delete", data);
	});
});

http.listen(port, async () => {

	async function emitBoardUpdate(data) {
		if(!data.operationType === "insert" && !data.operationType === "update")
			return;

		const _id = data.documentKey._id;
		const _board = await Board.findOne({ _id });
		const { name, description, isPublic, members } = _board;

		io.in(String(_id)).emit("board_update", {
			name,
			description,
			isPublic,
			members,
		});
	}

	async function emitCardUpdate(data) {
		if(!data.operationType === "insert" && !data.operationType === "update")
			return;

		const _id = data.documentKey._id;
		const _card = await Card.findOne({ _id }).populate([
			{
				path: "comments",
				populate: [
					{
						path: "author",
					},
				],
			},
			{
				path: "members",
			}
		]);

		if(!_card)
			return;

		const _list = await List.findOne({ _id: _card.listID });

		io.in(String(_list.boardID)).emit("card_update", _card);
	}

	async function emitListUpdate(data) {
		if(!data.operationType === "insert" && !data.operationType === "update")
			return;
		
		const _id = data.documentKey._id;
		const _list = await List.findOne({ _id });

		if(!_list)
			return;

		io.in(String(_list.boardID)).emit("list_update", _list);
	}

	await db.then(() => {
		const dbc = mongoose.connection;
		dbc.collection("boards").watch().on("change", emitBoardUpdate);
		dbc.collection("cards").watch().on("change", emitCardUpdate);
		dbc.collection("lists").watch().on("change", emitListUpdate);
	});
	
});

process.on("SIGINT", () => {
	mongoose.disconnect().then(() => {
		process.exit();
	});
});

module.exports = io;
