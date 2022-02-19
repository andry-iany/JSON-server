const ErrorResponse = require("../utils/ErrorResponse");

function route_404(req, res, next) {
	return next(new ErrorResponse("Not Found", 404));
}

module.exports = route_404;
