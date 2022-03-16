const { Resources } = require("../utils");
const { controllers } = require("../controllers");

/**
 * @param {*} app
 * @param {Resources} resources
 */
module.exports = function initRoutes(app, resources) {
	app.get("/", controllers.getAllEndpoints(resources));

	for (let resourceName of resources.getAllResourceNames()) {
		app.get(
			`/${resourceName}`,
			controllers.getResourceByName(resources, resourceName)
		);

		app.get(
			`/${resourceName}/:id`,
			controllers.getResourceElementById(resources, resourceName)
		);

		app.post(
			`/${resourceName}`,
			controllers.addResourceElement(resources, resourceName)
		);

		app.put(
			`/${resourceName}/:id`,
			controllers.editOrCreateResourceElement(resources, resourceName)
		);

		app.delete(
			`/${resourceName}/:id`,
			controllers.deleteResourceElement(resources, resourceName)
		);
	}
};
