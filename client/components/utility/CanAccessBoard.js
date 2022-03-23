/**
 * 
 * @param {Board} board The Board object to be compared.
 * @param {User} loggedIn The User to be compared.
 * @returns Boolean, whether the User is a member of the Board.
 */
export function isMember(board, loggedIn) {
	if(!loggedIn)
		return false;
	
	if(String(board.author._id) === String(loggedIn._id))
		return true;
		
	const members = board.members;

	for (let i = 0; i < members.length; i++) {
		if (String(members[i]._id) === String(loggedIn._id))
			return true;
	}
	return false;
}

/**
 * 
 * @param {Board} board The Board object to be compared.
 * @param {User} loggedIn The User to be compared.
 * @returns Boolean, whether the User has access to the Board.
 */
export function canAccessBoard(board, loggedIn) {
	if(!board.isPublic && loggedIn === null)
		return false;

	return board.isPublic ||
	(!board.isPublic &&
		isMember(board, loggedIn));
}

export default canAccessBoard;