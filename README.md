# JSON SERVER

A simple backend to create mock API from JSON file.

## Getting started

- Clone the repository.

- Install any dependencies: `npm install`

- Start the server `npm start`

## Features

- It takes the path to a JSON file, then creates endpoints from the resources in this file.

- Resource becomes an endpoint. Each resource contains an array of resource elements. Each resource element must contain an `id` field which is a number.

- Making GET for all of the resource items from a resource supports **pagination**.

- The JSON file should be like:

  ```json
  {
  	"resource": [
  		{
  			"id": 1,
  			"some data": "any data for the resource element"
  		}
  	],
  	"otherResource": [
  		{
  			"id": 1,
  			"other data": "something goes here..."
  		}
  	]
  }
  ```

  ```js
  // Inputing the path to the above resources to JSON server will provide the below endpoints:
  // - /resource
  // - /otherResource

  // GET / (returns all available endpoints)
  // GET /resource (returns all resource items from this resource)
  // GET /resource?_page=1&_limit=1 (get paginated results.)
  // GET /resource/:id
  // POST /resource
  // PUT /resource/:id
  // DELETE /resource/:id
  ```
