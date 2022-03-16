const ErrorResponse = require("../utils/ErrorResponse");

module.exports = function route_404(req, res, next) {
	return next(new ErrorResponse("Not Found", 404));
};
