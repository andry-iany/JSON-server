const Resources = require("../../src/utils/Resources");
const db = require("../../__testUtils__/setupDB");

describe("Resources.js", () => {
	let resources;
	let resourceName;

	beforeEach(() => {
		db.createTestFile();
		resources = new Resources(db.pathToTestData.value);
		resourceName = "resource";
	});

	afterEach(async () => {
		db.destroyTestFile();
	});

	it("should return an array containing all resource names if the resource file does exist.", () => {
		expect(resources.getAllResourceNames()).toEqual(
			expect.arrayContaining(Object.keys(db.testData))
		);
	});

	it("should throw an error if the resource file specified does not exist.", () => {
		expect(() => new Resources("not-found")).toThrow();
	});

	it("should return an array of resource element if the given resource name exists in the resource file.", () => {
		const resElts = resources.getResourceByName(resourceName);
		expect(resElts).toEqual(expect.arrayContaining(db.testData.resource));
	});

	it("should throw an error if there's no resource that matches the given name.", () => {
		resourceName = "not-found";
		expect(() => resources.getResourceByName(resourceName)).toThrow();
	});

	it("should return the resource element that has the given id.", () => {
		const resElt = resources.getResourceElementById(resourceName, 1);
		expect(resElt).toEqual(db.testData.resource.find((res) => res.id === 1));
	});

	it("should return an empty object if the resource element id given does not exist or is invalid.", () => {
		["", null, undefined, {}, [], true, -1].forEach((val) => {
			const resElt = resources.getResourceElementById(resourceName, val);
			expect(resElt).toEqual({});
		});
	});

	it("should update and return the resource element that matches the given id.", () => {
		const data = { id: 1, value: "updated value" };
		resources.save(resourceName, data);

		expect(resources.getResourceElementById(resourceName, 1)).toEqual(data);
	});

	it("should create and return a new resource element if no id is provided.", () => {
		const data = { value: "value without id" };
		resources.save(resourceName, data);

		expect(resources.getResourceElementById(resourceName, 2)).toEqual({
			id: 2,
			value: "value without id",
		});
	});

	it("should create and return a new resource element if no resource element has the given id.", () => {
		const data = { id: 2, value: "no matching id" };
		resources.save(resourceName, data);

		expect(resources.getResourceElementById(resourceName, 2)).toEqual(data);
	});

	it("should create and return a new resource element that has an id which is equal to the 1 + previously largest id if no resource element has the given id.", () => {
		const data = { id: 3, value: "with id way bigger than the current max" };
		resources.save(resourceName, data);

		expect(resources.getResourceElementById(resourceName, 2)).toEqual({
			id: 2,
			value: "with id way bigger than the current max",
		});
	});

	it("should delete the resource element having the given id.", () => {
		resources.delete(resourceName, 1);
		expect(resources.getResourceByName(resourceName).length).toBe(0);
		expect(resources.getResourceElementById(resourceName, 1)).toEqual({});

		resources.save(resourceName, { value: "something here" });
		resources.save(resourceName, { value: "something else" });
		resources.save(resourceName, { value: "another something else" });
		resources.delete(resourceName, 3);
		expect(resources.getResourceByName(resourceName).length).toBe(2);
	});
});
