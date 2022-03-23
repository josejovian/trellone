function isAdminOfBoard(id, board) {
	return (String(board.author) === String(id));
}

function isMemberOfBoard(id, board) {
	return (board.members.filter((memberID) => {
		return String(memberID) === String(id);
	})).length === 1;
}

function hasAccessToBoard(id, board) {
	return isAdminOfBoard(id, board) || isMemberOfBoard(id, board);
}

function denyAccess(id, board, lv, res, reason="Insufficient permission.") {
	if((lv === 1 && hasAccessToBoard(id, board)) || (lv === 2 && isAdminOfBoard(id, board)))
		return false;
	else {
		res.statusMessage = reason;
		res.status(204).send("");
		return true;
	}
}

module.exports = {
	isAdminOfBoard,
	isMemberOfBoard,
	hasAccessToBoard,
	denyAccess
};