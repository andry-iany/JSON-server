const fs = require("fs");

class Resources {
	#_pathToResources;

	constructor(pathToResources) {
		if (this.#_isResourcesFileExisting(pathToResources))
			this.#_pathToResources = pathToResources;
		else throw new Error("Invalid resources.");
	}

	#_isResourcesFileExisting(pathToResources) {
		return fs.existsSync(pathToResources);
	}

	save(resourceName, resourceElementData) {
		const allResources = this.#_getResources();
		let resEltToSave = { ...resourceElementData };

		if (this.isResourceElementWithIdExisting(resourceName, resEltToSave.id)) {
			allResources[resourceName] = allResources[resourceName].map((resElt) => {
				return resElt.id === resEltToSave.id ? resEltToSave : resElt;
			});
		} else {
			resEltToSave.id = this.#_getNextIdForResource(resourceName);
			allResources[resourceName].push(resEltToSave);
		}

		fs.writeFileSync(
			this.#_pathToResources,
			JSON.stringify(allResources, null, "\t")
		);

		return this.getResourceElementById(resourceName, resEltToSave.id);
	}

	delete(resourceName, resourceEltId) {
		if (this.isResourceElementWithIdExisting(resourceName, resourceEltId)) {
			const resToDelete = this.getResourceElementById(
				resourceName,
				resourceEltId
			);
			const allResources = this.#_getResources();
			allResources[resourceName] = allResources[resourceName].filter(
				(resElt) => resElt.id !== resourceEltId
			);
			fs.writeFileSync(
				this.#_pathToResources,
				JSON.stringify(allResources, null, "\t")
			);
			return resToDelete;
		} else return false;
	}

	isResourceElementWithIdExisting(resourceName, id) {
		const resElt = this.getResourceElementById(resourceName, id);
		return resElt.id && resElt.id === id; // we get {} if no resource element id matches the given id, so we need to check on the id property itself to verify whether the element does exist.
	}

	getAllResourceNames() {
		return Object.keys(this.#_getResources());
	}

	getResourceByName(resourceName) {
		const resource = this.#_getResources()[resourceName];
		if (resource === undefined) throw new Error("Invalid resource.");
		return resource;
	}

	getResourceElementById(resourceName, id) {
		const resource = this.getResourceByName(resourceName);
		return resource.find((resElt) => resElt.id === id) || {};
	}

	#_getNextIdForResource(resourceName) {
		const curMaxId = this.getResourceByName(resourceName).reduce(
			(acc, curElt) => (acc > curElt.id ? acc : curElt.id),
			0
		);
		return curMaxId + 1;
	}

	#_getResources() {
		try {
			return require(this.#_pathToResources);
		} catch (err) {
			throw new Error(`Invalid resources: ${err.message}`);
		}
	}
}

module.exports = Resources;
