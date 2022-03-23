function exception(res, reason="Insufficient permission.") {
	res.statusMessage = reason;
	res.status(204).send("");
}

module.exports = {
	exception
};