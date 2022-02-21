const { createInterface, clearScreenDown, cursorTo } = require("readline");
const promisify = require("util").promisify;

const readlineInterface = createInterface({
	input: process.stdin,
	output: process.stdout,
});

async function question(message) {
	return new Promise((resolve) => {
		readlineInterface.question(message, (data) => {
			resolve(data);
		});
	});
}

async function clearScreen() {
	await promisify(cursorTo)(process.stdout, 0, 0);
	await promisify(clearScreenDown)(process.stdout);
}

module.exports = { clearScreen, question };
