// Styling
import { Box, useToast, Flex, Heading, Text } from "@chakra-ui/react";

// Components
import Meta from "../../components/Meta";
import BoardMenu from "../../components/BoardMenu";
import BoardContent from "../../components/BoardContent";
import Error from "../../components/Error";

// Utility
import {
	canAccessBoard,
	isMember,
} from "../../components/utility/CanAccessBoard";
import { AccessContext } from "../../components/utility/AccessContext";
import { SocketContext } from "../../components/utility/SocketContext";
import { showToast, showStandardToast } from "../../components/utility/Toast";

// Redux
import {
	mapDispatchToProps,
	mapStateToProps,
} from "../../components/redux/setter";
import { connect } from "react-redux";

// Misc
import { useRef, useState, useEffect } from "react";
import api from "../../components/API";
import io from "socket.io-client";

export function Board({ _board, id, loggedIn, allMembers, currentCard, setCard, setBoard}) {
	const [board, _setBoard] = useState(_board);
	const toast = useToast();
	const toastIdRef = useRef();

	/* ---------- Socket-related stuff to emulate real-time interaction --------- */

	const [socket, setSocket] = useState(
		io(process.env.NEXT_PUBLIC_API_EP, { transports: ["websocket", "polling"] })
	);

	// Update new board for users who subbed to this board.
	function applyBoard(_board) {
		
		
		_setBoard({
			...board,
			..._board,
		});
	}

	/*
		TODO:
		Instead of index-based array, may try to use dictionary for better time complexity.
	*/

	// Update involved lists and card when user drags a card from a list to another.
	function applySwitch({ from, to }) {
		
		const boardLists = board.lists;
		let listFrom, listTo;

		function sameList() {
			return String(from.listID) === String(to.listID);
		}

		let remaining = 0;
		boardLists.every((list) => {
			if (String(list._id) === String(from.listID)) {
				listFrom = list;
				remaining--;
			}
			if (String(list._id) === String(to.listID)) {
				listTo = list;
				remaining--;
			}
			return (remaining !== 0);
		});

		let returnCard;
		function removeFromList(dbList) {
			dbList.cards = dbList.cards.filter((card, index) => {
				if(String(card._id) === String(from.cardID)) {
					returnCard = card;
				}
				return String(card._id) !== String(from.cardID);
			});
		}

		function addToList(dbList) {
			dbList.cards.splice(to.cardIndex + 0.5, 0, returnCard);
		}

		if (sameList()) {
			if (from.cardIndex < to.cardIndex) {
				to.cardIndex -= 1;
			};
			removeFromList(listFrom);
			addToList(listFrom);
		} else {
			removeFromList(listFrom);
			addToList(listTo);
			applyList(listTo);
		}

		applyList(listFrom);
		returnCard.listID = listTo._id;
		applyCard(returnCard);
	}

	// Update new list for users who subbed to this board.
	function applyList(_list) {
		const boardLists = board.lists;

		boardLists.forEach((list, index) => {
			if (String(list._id) === String(_list._id)) {
				boardLists[index] = _list;
			}
		});

		_setBoard({
			...board,
			lists: boardLists,
		});
	}

	// Update list (only the name) for users who subbed.
	function applyListShallow(_list) {
		const boardLists = board.lists;	

		boardLists.forEach((list, index) => {
			if (String(list._id) === String(_list._id)) {
				boardLists[index].name = _list.name;
			}
		});

		_setBoard({
			...board,
			lists: boardLists,
		});
	}

	// Update new card for users who subbed to this board.
	function applyCard(_card, _indexes=null) {
		const boardLists = board.lists;

		if(!_card)
			return;

		if(_indexes !== null) {
			boardLists[_indexes.list].cards[_indexes.card] = _card;
			setCard(_card, boardLists[_indexes.list].name);
		} else {
			boardLists.every((list, idx) => {
				
				if (String(list._id) === String(_card.listID)) {
					list.cards.every((card, index) => {
						if (String(card._id) === String(_card._id)) {
							list.cards[index] = _card;
							setCard(_card, list.name);
							return false;
						}
						return true;
					});
					return false;
				}
				return true;
			});
		}
		_setBoard({
			...board,
			lists: boardLists,
		});
	} 

	// Add a new card for users who subbed to this board.
	function applyNewCard(_card) {
		const boardLists = board.lists;

		boardLists.forEach((list, index) => {
			if (String(list._id) === String(_card.listID)) {
				boardLists[index].cards.push(_card);
			}
		});
		_setBoard({
			...board,
			lists: boardLists,
		});
	}

	// Find a card based on the ID, then update it immediately.
	function applyCardFromID(data) {
		const boardLists = board.lists;
		let result;

		function loopCards(listIndex) {
			boardLists[listIndex].cards.every((card, index) => {
				if(String(card._id) === String(data.cardID)) {
					applyCard(card, {
						list: listIndex,
						card: index
					});
					return false;
				}
				return true;
			});
		}

		function loopLists(callback) {
			
			boardLists.every((list, index) => {
				
				if (String(list._id) === String(data.listID)) {
					loopCards(index);
					return false;
				}
				return true;
			});

			return callback;
		}

		loopLists(null);
					
		applyCard(result);
	}

	// Remove list, if users subbed to the list's board.
	function applyRemovedList(id) {
		let boardLists = board.lists;
		
		boardLists = boardLists.filter((list) => {
			return String(list._id) !== String(id);
		});

		_setBoard({
			...board,
			lists: boardLists,
		});
	}

	// Remove card, if users subbed to the list's board.
	function applyRemovedCard(_card) {
		const boardLists = board.lists;

		boardLists.every((list, idx) => {
			if (String(list._id) === String(_card.listID)) {
				list.cards = list.cards.filter((card) => {
					return String(card._id) !== String(_card._id)
				});
				return false;
			}
			return true;
		});

		_setBoard({
			...board,
			lists: boardLists,
		});
	}

	// Add list, if users subbed to the list's board.
	function applyNewList(_list) {
		
		const boardLists = board.lists;
		boardLists.push(_list);

		_setBoard({
			...board,
			lists: boardLists
		});
	}

	function applyNewMember(params) {
		if(params.type === "board") {
			applyBoard({
				...board,
				members: board.members.concat([ params.data ])
			});
		} else {
			applyCardFromID(params.data.cardID);
		}
	}

	function applyRemovedMember(params) {
		if(params.type === "board") {
			applyBoard({
				...board,
				members: board.members.filter((member) => {
					return String(member._id) !== String(params.data)
				})
			});
		} else {
			applyCardFromID(params.data.cardID);
		}
	}

	useEffect(() => {
		if(_board) {
			socket.emit("board_subscribe", {
				id: _board._id,
			});
		} else {
			setBoard(null);
		}
		return () => {
			_setBoard(_board); // This worked for me
		};
	}, []);

	useEffect(() => {
		// Listen for Update
		socket.on("board_update", applyBoard);
		socket.on("switch_update", applySwitch);
		socket.on("list_update", applyListShallow);
		socket.on("card_update", applyCard);
		socket.on("comment_update", applyCardFromID);

		// Listen for Create
		socket.on("member_new", applyNewMember);
		socket.on("attachment_new", applyCardFromID);
		socket.on("comment_new", applyCardFromID);
		socket.on("card_new", applyNewCard);
		socket.on("list_new", applyNewList);

		// Listen for Removal
		socket.on("member_delete", applyRemovedMember);
		socket.on("card_delete", applyRemovedCard);
		socket.on("list_delete", applyRemovedList);
		socket.on("comment_delete", applyCardFromID);
		socket.on("attachment_delete", applyCardFromID);

	}, [socket]);

	// Function to add member to card/board.
	async function addMember(type, _id, member) {
		await api.post(`/member/add/${type}`, {
			type: type,
			id: _id,
			memberID: member._id,
			boardID: id,
			userID: loggedIn._id
		}).then((result) => {
			if(result.status !== 200) {
				showToast(toast, toastIdRef, "Oops!", result.statusText, "error", 2000, true);
			} else {
				socket.emit(`member_new`, {
					data: result.data,
					boardID: id,
					type,
				});
				showToast(toast, toastIdRef, "Done!", "This person is now a member.", "success", 2000, true);
			}
		}).catch((e) => {
			showStandardToast(toast, toastIdRef, "genericFail");
		});
	}

	async function removeMember(type, _id, member) {
		await api.post(`/member/remove/${type}`, {
			type: type,
			id: _id,
			memberID: member._id,
			userID: loggedIn._id
		}).then((result) => {
			socket.emit(`member_delete`, {
				data: result.data,
				boardID: id,
				type,
			});
			showToast(toast, toastIdRef, "Done!", "This person is no longer a member.", "success", 2000, true);
			
		}).catch((e) => {
			showStandardToast(toast, toastIdRef, "genericFail");
		});
	}

	/*
		Show no access screen if the board doesn't exist
		or the user isn't a member of the board.
	*/
	if (!board || !canAccessBoard(board, loggedIn)) {
		return (
			<Error head="Oops!" desc="You have no access to this board." />
		);
	}

	/* 
		Each user has a permission level when accessing a board (0 guest; 1 member; 2 owner). 
		Nested ternary looks ugly, so functions are used instead.
	*/

	function compareMemberOwner() {
		// If it's not the author, then they only has level 1 access.
		return String(board.author._id) !== String(loggedIn._id) ? 1 : 2;
	}

	function compareGuestMember() {
		// Non-logged in users OR non-board member users have level 0 access.
		return !loggedIn || !isMember(board, loggedIn)
			? 0
			: compareMemberOwner();
	}

	const accessLevel = compareGuestMember();
	return (
		<AccessContext.Provider value={{ level: accessLevel, memberLv: 1, adminLv: 2 }}>
			<SocketContext.Provider value={{ socket, setSocket }}>
				<Meta title={board.name} description="Collaborate with your team and coordinate your project with a kanban board." />
				<Box overflowY="hidden">
					<BoardMenu
						board={board}
						id={id}
						allMembers={allMembers}
						loggedIn={loggedIn}
						addMember={addMember}
						removeMember={removeMember}
					/>
					<BoardContent board={board} id={id} addMember={addMember} removeMember={removeMember} />
				</Box>
			</SocketContext.Provider>
		</AccessContext.Provider>
	);
}

export async function getServerSideProps(req) {
	const allMembers = await api.get(`/users`).then((res) => {
		if (res.status === 200) return res.data;
		else return null;
	});

	const _board = await api
		.get(`/board/${req.query.id}`)
		.then((res) => {
			if (res.status === 200) {
				
				return res.data;
			} else return null;
		})
		.catch((e) => {
			return null;
		});

	// Pass data to the page via props
	return { props: { _board, id: req.query.id, allMembers } };
}

export default connect(mapStateToProps, mapDispatchToProps)(Board);
