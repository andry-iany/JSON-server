const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const initRoutes = require("./routes/routes");

function createApp(resources) {
	const app = express();

	// middlewares
	app.use(cors());
	app.use(express.json());
	app.use(express.urlencoded({ extended: false }));
	app.use(morgan("dev"));

	// routes
	initRoutes(app, resources);

	// 404
	app.use(require("./routes/404"));

	// error handler
	app.use(require("./middlewares/error"));

	return app;
}

module.exports = createApp;
