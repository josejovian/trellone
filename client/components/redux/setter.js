export function setCard(currentCard, currentList, callback=null) {
	if(callback !== null)
		callback();
	
	return {
		type: "cardSet",
		currentCard: currentCard,
		currentList: currentList,
	};
}

export function setAllBoards(currentAllBoards) {
	return {
		type: "allBoardsSet",
		currentAllBoards: currentAllBoards
	};
}

export function setEditList(editList) {
	return {
		type: "editListSet",
		editList: editList
	};
}

export function setBoard(currentBoard) {
	return {
		type: "boardSet",
		currentBoard: currentBoard
	};
}

export function setQueries(currentQueries) {
	return {
		type: "querySet",
		currentQueries: currentQueries
	};
}

export function loginUser(loggedIn) {
	return {
		type: "userLogin",
		loggedIn: loggedIn
	};
}

export function logoutUser() {
	return {
		type: "userLogout",
		loggedIn: null
	};
}

export function setCanEditBoard(bool) {
	return {
		type: "canEditBoardSet",
		canEditBoard: bool
	};
}

export function mapStateToProps(state) {
	return {
		currentAllBoards: state.currentAllBoards,
		currentBoard: state.currentBoard,

		// When viewing a particular card, the following
		// helper variables are used.
		currentCard: state.currentCard,
		currentList: state.currentList,
		editList: state.editList,

		// Temporarily store all tags of a board for shortcut.
		// These are not stored in the database.
		currentTags: state.currentTags,
		
		// Store Pexels Query Results.
		currentQueries: state.currentQueries,

		// Self-explanatory.
		loggedIn: state.loggedIn,
		canEditBoard: state.canEditBoard
	};
}

export const mapDispatchToProps = {
	setCard,
	setAllBoards,
	setBoard,
	loginUser,
	logoutUser,
	setQueries,
	setEditList,
	setCanEditBoard
};