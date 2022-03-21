const { ErrorResponse, formatResponse, paginationUtils } = require("../utils");
const formatResponseSuccess = formatResponse.formatResponseSuccess;
const formatResponseSuccessWithPagination =
	formatResponse.formatResponseSuccessWithPagination;

exports.getAllEndpoints = function (resources) {
	return (req, res, next) => {
		const endpoints = resources
			.getAllResourceNames()
			.map((resource) => "/" + resource);
		res.status(200).json(formatResponseSuccess(endpoints));
	};
};

exports.getResourceByName = function (resources, resourceName) {
	return (req, res, next) => {
		let format = formatResponseSuccess;
		let results = resources.getResourceByName(resourceName);

		const pageAndLimit = paginationUtils.getPageAndLimitIfValid(req.query);
		if (pageAndLimit) {
			format = formatResponseSuccessWithPagination;
			results = getResourceByNameWithPagination(results, pageAndLimit);
		}

		return res.status(200).json(format(results));
	};
};

function getResourceByNameWithPagination(rawResults, pageAndLimit) {
	const { _page, _limit } = pageAndLimit;
	const pageStart = (_page - 1) * _limit;
	return {
		data: rawResults.slice(pageStart, pageStart + _limit),
		maxPage: paginationUtils.getMaxPage(rawResults.length, _limit),
		currentPage: _page,
	};
}

exports.getResourceElementById = function (resources, resourceName) {
	return (req, res, next) => {
		const id = Number(req.params.id);
		if (resources.isResourceElementWithIdExisting(resourceName, id)) {
			const resourceElt = resources.getResourceElementById(resourceName, id);
			res.status(200).json(formatResponseSuccess(resourceElt));
		} else {
			return next(new ErrorResponse("Not found.", 404));
		}
	};
};

exports.addResourceElement = function (resources, resourceName) {
	return (req, res, next) => {
		const content = req.body;
		if (Object.keys(content).length === 0)
			return next(new ErrorResponse("Content body is mandatory.", 400));

		const savedElt = resources.save(resourceName, { ...content, id: NaN });
		res.status(201).json(formatResponseSuccess(savedElt));
	};
};

exports.editOrCreateResourceElement = function (resources, resourceName) {
	return (req, res, next) => {
		const content = req.body;
		if (Object.keys(content).length === 0)
			return next(new ErrorResponse("Content body is mandatory.", 400));

		const id = Number(req.params.id);
		if (!resources.isResourceElementWithIdExisting(resourceName, id))
			return next(new ErrorResponse("Resource item not found.", 404));

		const savedElt = resources.save(resourceName, { ...content, id });
		res.status(200).json(formatResponseSuccess(savedElt));
	};
};

exports.deleteResourceElement = function (resources, resourceName) {
	return (req, res, next) => {
		const id = Number(req.params.id);
		if (!resources.isResourceElementWithIdExisting(resourceName, id))
			return next(new ErrorResponse("Resource item not found.", 404));

		const deletedItem = resources.delete(resourceName, id);
		res.status(200).send(formatResponseSuccess(deletedItem));
	};
};
