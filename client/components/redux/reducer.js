const initialState = {
	currentBoard: null,
	currentCard: null,
	currentList: null,
	currentTags: [],
	loggedIn: null,
	currentQueries: [],
	editList: null,
};

export const reducer = (state = initialState, action) => {
	switch (action.type) {
		case "cardSet":
			const tags = action.currentCard.tags;
			const existing = state.currentTags;
			tags.forEach((tag) => {
				if (!existing.includes(tag)) {
					existing.push(tag);
				}
			});
			return {
				...state,
				currentCard: action.currentCard,
				currentList: action.currentList,
				currentTags: existing,
			};
		case "allBoardsSet":
			return {
				...state,
				currentAllBoards: action.currentAllBoards,
			};
		case "boardSet":
			return {
				...state,
				currentBoard: action.currentBoard,
			};
		case "querySet":
			return {
				...state,
				currentQueries: action.currentQueries,
			}
		case "userLogin":
			return {
				...state,
				loggedIn: action.loggedIn,
			};
		case "userLogout":
			return {
				...state,
				loggedIn: null,
			};
		case "editListSet":
			return {
				...state,
				editList: action.editList,
			};
		case "canEditBoardSet":
			return {
				...state,
				canEditBoard: action.canEditBoard,
			};
		default:
			return state;
	}
};

export default reducer;