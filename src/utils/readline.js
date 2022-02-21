const { createInterface } = require("readline");

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

module.exports = { question };
