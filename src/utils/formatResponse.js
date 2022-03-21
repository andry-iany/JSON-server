exports.formatResponseSuccess = (data) => {
	return {
		success: true,
		data,
	};
};

exports.formatResponseSuccessWithPagination = function ({
	data,
	currentPage,
	maxPage,
}) {
	return { success: true, data, currentPage, maxPage };
};

exports.formatResponseError = (error) => {
	return {
		success: false,
		error,
	};
};
