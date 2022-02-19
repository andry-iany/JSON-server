const express = require("express");
const cors = require("cors");
const initRoutes = require("./routes/routes");

function createApp(resources) {
	const app = express();

	// middlewares
	app.use(cors());
	app.use(express.json());
	app.use(express.urlencoded({ extended: false }));

	// routes
	initRoutes(app, resources);

	// 404
	app.all("*", require("./routes/404"));

	// error handler
	app.use(require("./middlewares/error"));

	return app;
}

module.exports = createApp;
