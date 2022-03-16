const path = require("path");
const createApp = require("./src/app");
const Resources = require("./src/utils/Resources");
const { question, clearScreen } = require("./src/utils/readline");

let port, resources;

async function startServer() {
	while (true) {
		try {
			let result = await getPortAndPathToResources();
			resources = new Resources(result.pathToResources);
			port = result.port;

			const app = createApp(resources);
			const server = app.listen(port);

			// we wrap "error" and "listening" events inside promise to be able to use try/catch
			await new Promise((resolve, reject) => {
				server.on("error", (err) => reject(err));
				server.on("listening", () => resolve());
			});

			await clearScreenAndPrintEndpointsInfo();

			break; // server is running so exit the loop
		} catch (err) {
			handleError(err);
		}
	}
}

async function getPortAndPathToResources() {
	let pathToResources = await question("Path to JSON: ");
	let port = await question("Port: ");
	return {
		pathToResources: path.resolve(__dirname, pathToResources),
		port,
	};
}

function handleError(error) {
	console.log(`ERROR: ${error.message}\n`);
}

async function clearScreenAndPrintEndpointsInfo() {
	await clearScreen();
	printEndpointsInfo();
}

function printEndpointsInfo() {
	const apiRoot = `http://localhost:${port}`;

	console.log(`JSON server is running on port: ${port}.`);
	console.log("You can send request to the available endpoints:\n");
	console.log(`${apiRoot} (returns all endpoints.)`);

	for (let resourceName of resources.getAllResourceNames()) {
		console.log(`${apiRoot}/${resourceName}`);
	}

	console.log("\n----------- logs ------------");
}

module.exports = startServer;
