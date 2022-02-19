const { formatResponseError } = require("../utils/formatResponse");

function handleError(error, req, res, next) {
	return res
		.status(error.statusCode || 500)
		.json(formatResponseError(error.message || "An error occured"));
}

module.exports = handleError;