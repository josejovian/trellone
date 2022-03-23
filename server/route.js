const express = require("express");
const routes = express.Router();
const dbo = require("./conn");
const axios = require("axios");

const ObjectId = require("mongodb").ObjectId;
const User = require("./model/User").model;
const Board = require("./model/Board").model;
const Card = require("./model/Card").model;
const Comment = require("./model/Comment").model;

const {
	getAllUsers,
	getAllBoards,
	getBoard,
	updateBoard,
	createBoard,
} = require("./controller/boardController");

const {
	getAllCards,
	createCard,
	updateCard,
	switchCard,
	deleteCard,
	getList,
	createList,
	updateList,
	deleteList,
	createComment,
	updateComment,
	deleteComment,
	addMember,
	removeMember
} = require("./controller/cardController");

routes.route("/all").get(getAllBoards);

routes.route("/login/start").get((req, res) => {
	res.redirect(
		`https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}`
	);
});

routes.route("/login/end").post(async (req, res) => {
	function fetchDataFail(e) {
		
	}

	await axios
		.post(
			"https://github.com/login/oauth/access_token",
			{
				client_id: process.env.CLIENT_ID,
				client_secret: process.env.CLIENT_SECRET,
				code: req.body.code,
			},
			{ headers: { accept: "application/json" } }
		)
		.then(async (tokenResponse) => {
			await axios
				.get("https://api.github.com/user", {
					headers: {
						Authorization: `token ${tokenResponse.data["access_token"]}`,
					},
				})
				.then(async (userResponse) => {
					const userData = userResponse.data;

					let user = await User.findOne({
						githubID: userData.id,
					});

					if (user === null || user === undefined) {
						user = new User({
							githubID: userData.id,
							name: userData.login,
							pictureURL: userData.avatar_url,
						});
					} else {
						user.githubID = userData.id;
						user.name = userData.login;
						user.pictureURL = userData.avatar_url;
					}

					await user.save();
					res.send(user);
				})
				.catch((e) => {
					fetchDataFail(e);
				});
		})
		.catch((e) => {
			fetchDataFail(e);
		});
});

routes.route("/logout").post(async (req, res) => {
	await axios.delete(
		`https://api.github.com/applications/${process.env.CLIENT_ID}/grant`,
		{
			data: {
				access_token: req.body.code,
			},
		}
	);
});

routes.route("/member/add/card").post(addMember);
routes.route("/member/add/board").post(addMember);
routes.route("/member/remove/card").post(removeMember);
routes.route("/member/remove/board").post(removeMember);

routes.route("/new/board").post(createBoard);
routes.route("/new/list").post(createList);
routes.route("/new/card").post(createCard);
routes.route("/new/comment").post(createComment);

routes.route("/board/:id").get(getBoard).post(updateBoard);
routes.route("/list/:id").get(getList).post(updateList).delete(deleteList);
routes.route("/card/:id").post(updateCard).delete(deleteCard);
routes.route("/comment/:id").post(updateComment).delete(deleteComment);

routes.route("/switch/:id").post(switchCard);
routes.route("/image/:query").get(async (req, res) => {
	let result = await axios
		.get(
			`https://api.pexels.com/v1/search?query=${req.params.query}&per_page=8`,
			{
				headers: {
					Authorization: process.env.NEXT_API_KEY,
				},
			}
		)
		.catch((e) => {
			res.send(null);
		});
	res.send(result.data);
});

routes.route("/cards").get(getAllCards);
routes.route("/users").get(getAllUsers);

module.exports = routes;
