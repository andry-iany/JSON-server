require("dotenv").config({ path: "./.env" });

const path = require("path");
const createApp = require("./src/app");
const Resources = require("./src/utils/Resources");
const pathToJson = path.resolve(__dirname, "./temp_data.json");

const init = () => {
	const resources = new Resources(pathToJson);
	const app = createApp(resources);
	const port = process.env.PORT || 8080;

	app.listen(port, () => console.log(`Server running in port ${port}`));
};

init();
