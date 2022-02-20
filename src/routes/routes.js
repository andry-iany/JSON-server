const ErrorResponse = require("../utils/ErrorResponse");
const { formatResponseSuccess } = require("../utils/formatResponse");
const Resources = require("../utils/Resources");

/**
 *
 * @param {*} app
 * @param {Resources} resources
 */
const initRoutes = (app, resources) => {
	for (let resourceName of resources.getAllResourceNames()) {
		app.get(`/${resourceName}`, (req, res, next) => {
			res
				.status(200)
				.json(formatResponseSuccess(resources.getResourceByName(resourceName)));
		});

		app.get(`/${resourceName}/:id`, (req, res, next) => {
			const id = Number(req.params.id);
			if (resources.isResourceElementWithIdExisting(resourceName, id)) {
				const resourceElt = resources.getResourceElementById(resourceName, id);
				res.status(200).json(formatResponseSuccess(resourceElt));
			} else {
				return next(new ErrorResponse("Not found.", 404));
			}
		});

		app.post(`/${resourceName}`, (req, res, next) => {
			const savedElt = resources.save(resourceName, { ...req.body, id: NaN });
			res.status(201).json(formatResponseSuccess(savedElt));
		});

		app.put(`/${resourceName}/:id`, (req, res, next) => {
			const content = req.body;
			if (Object.keys(content).length === 0)
				return next(new ErrorResponse("Content body is mandatory.", 400));

			const id = Number(req.params.id);
			if (!resources.isResourceElementWithIdExisting(resourceName, id))
				return next(new ErrorResponse("Resource item not found.", 404));

			const savedElt = resources.save(resourceName, { ...content, id });
			res.status(200).json(formatResponseSuccess(savedElt));
		});
	}
};

module.exports = initRoutes;
