const db = require("../../__testUtils__/setupDB");
const request = require("supertest");
const createApp = require("../../src/app");
const Resources = require("../../src/utils/Resources");

const apiRoot = "/resource";
let app;

const makeGet = () => request(app).get(apiRoot);
const makeGetWithId = (id) => request(app).get(`${apiRoot}/${id}`);
const makeRequestToNotFound = (method) => request(app)[method]("/not-found");
const makePost = (body) => request(app).post(apiRoot).send(body);
const makePut = (id, body) => request(app).put(`${apiRoot}/${id}`).send(body);
const makeDelete = (id) => request(app).delete(`${apiRoot}/${id}`);
const checkSuccessResponseBody = (resBody) => {
	expect(resBody).toHaveProperty("success", true);
	expect(resBody).toHaveProperty("data");
};
const checkErrorResponseBody = (resBody) => {
	expect(resBody).toHaveProperty("success", false);
	expect(resBody).toHaveProperty("error");
};

beforeEach(() => {
	db.createTestFile();
	app = createApp(new Resources(db.pathToTestData.value));
});

afterEach(() => {
	db.destroyTestFile();
});

describe("GET /resource", () => {
	describe("success", () => {
		it("should return 200 when resource exists.", async () => {
			await makeGet().expect(200);
		});

		it("should return an object that has property:value 'success:true' and 'data:object' if success.", async () => {
			const response = await makeGet();
			checkSuccessResponseBody(response.body);
		});

		it("should return an array of valid data if resource exists", async () => {
			const response = await makeGet();
			expect(response.body.data).toEqual(
				expect.arrayContaining(db.testData[apiRoot.substring(1)])
			);
		});
	});
});

describe("GET /resource/:id", () => {
	describe("success", () => {
		it("should return 200 when resource and resource element with the given id exist.", async () => {
			await makeGetWithId(1).expect(200);
		});

		it("should return an object that has property:value 'success:true' and 'data:object' if success.", async () => {
			const response = await makeGetWithId(1);
			checkSuccessResponseBody(response.body);
		});

		it("should return valid data if element having the given id exists", async () => {
			const response = await makeGetWithId(1);
			expect(response.body.data).toHaveProperty("id", 1);
		});
	});

	describe("error", () => {
		it("should return 404 if no resource element has the given id.", async () => {
			await makeGetWithId(3).expect(404);
		});

		it("should return an object that has property:value 'success:false' and 'error:string' if error.", async () => {
			const response = await makeRequestToNotFound("get");
			checkErrorResponseBody(response.body);
		});
	});
});

describe("POST /resource", () => {
	describe("success", () => {
		it("should return 201 when sending request to an existing resource to create a new resource item.", async () => {
			await makePost({ value: "something new" }).expect(201);
		});

		it("should return an object that has property:value 'success:true' and 'data:object' if success.", async () => {
			const response = await makePost({ value: "something new" });
			checkSuccessResponseBody(response.body);
		});

		it("should return a valid object that has all the values of the data sent in the request body with its id if POSTing to an existing resource.", async () => {
			const body = { value: "something new" };
			const response = await makePost(body);
			expect(response.body.data).toEqual({ ...body, id: 2 });
		});

		it("should create a new element with different id even if the id provided in the body does exist.", async () => {
			const body = { id: 1, value: "something new" };
			const response = await makePost(body);
			expect(response.body.data.id).not.toBe(body.id);
		});
	});
});

describe("PUT /resource/:id", () => {
	describe("success", () => {
		it("should return 200 when updating an existing resource.", async () => {
			await makePut(1, { value: "here is the updated value" }).expect(200);
		});

		it("should return an object that has property:value 'success:true' and 'data:object' if success.", async () => {
			const response = await makePut(1, { value: "something new" });
			checkSuccessResponseBody(response.body);
		});

		it("should return a valid object with updated values.", async () => {
			const body = { value: "we should receive updated value" };
			const response = await makePut(1, body);
			expect(response.body.data).toEqual({ ...body, id: 1 });
		});
	});

	describe("error", () => {
		it("should return 404 no element has the given id.", async () => {
			await makePut(2, { value: "something" }).expect(404);
		});

		it("should return 400 if a resource element has matching id but there's no value in the body of the request.", async () => {
			await makePut(1, {}).expect(400);
		});

		it("should return an object that has property:value 'success:false' and 'error:string' if error, ie either no matching resource element or the body is empty.", async () => {
			const responseNotFound = await makePut(2, {
				value: "has value but no matching id",
			});
			const responseBadRequest = await makePut(1, {});

			checkErrorResponseBody(responseNotFound.body);
			checkErrorResponseBody(responseBadRequest.body);
		});
	});
});

describe("DELETE /resource/:id", () => {
	describe("success", () => {
		it("should return 200 when deleting an existing resource.", async () => {
			await makeDelete(1).expect(200);
		});

		it("should return an object that has property:value 'success:true' and 'data:object' if success.", async () => {
			const response = await makeDelete(1);
			checkSuccessResponseBody(response.body);
		});

		it("should return a valid object where data contains the value of the deleted content.", async () => {
			const response = await makeDelete(1);
			expect(response.body.data).toHaveProperty("id", 1);
		});

		it("should delete the element from the resource.", async () => {
			await makeDelete(1);

			await makeGetWithId(1).expect(404);
		});
	});

	describe("error", () => {
		it("should 404 when trying to delete an element that does not exist.", async () => {
			await makeDelete(2).expect(404);
		});
	});
});

describe("Make request to a resource that doesn't exist.", () => {
	const methods = ["get", "post", "put", "delete"];

	it("should return 404 when making request to a resource that doesn't exist regardless of the method.", () => {
		methods.forEach(async (method) => {
			await makeRequestToNotFound(method).expect(404);
		});
	});

	it("should return an object that has property:value 'success:false' and 'error:string' when when making request to a resource that doesn't exist regardless of the method.", () => {
		methods.forEach(async (method) => {
			const response = await makeRequestToNotFound(method);
			checkErrorResponseBody(response.body);
		});
	});
});
