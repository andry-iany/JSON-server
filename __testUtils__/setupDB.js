const path = require("path");
const fs = require("fs");

let pathToTestData = { value: path.resolve(__dirname, Date.now() + ".json") }; // we use object instead of plain string to be able to change this value and all of its references get updated
const testData = { resource: [{ id: 1, value: "something 1" }] };

const createTestFile = () => {
	fs.writeFileSync(pathToTestData.value, JSON.stringify(testData, null, "\t"));
};

const destroyTestFile = () => {
	fs.unlinkSync(pathToTestData.value);
	pathToTestData.value = path.resolve(__dirname, Date.now() + ".json");
};

module.exports = {
	pathToTestData,
	testData,
	createTestFile,
	destroyTestFile,
};
