const formatResponseSuccess = (data) => {
	return {
		success: true,
		data,
	};
};

const formatResponseError = (error) => {
	return {
		success: false,
		error,
	};
};

module.exports = { formatResponseError, formatResponseSuccess };
