exports.paginateArray = (array, page, limit) => {
  if (isNaN(page) || isNaN(limit)) {
    return {
      data: array,
      currentPage: page || 1,
      total: array?.length || 0,
      totalPages: Math.ceil(array?.length / 10),
    };
  }
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const results = {};

  if (endIndex < array?.length) {
    results.next = {
      page: page + 1,
      limit: limit,
    };
  }

  if (startIndex > 0) {
    results.previous = {
      page: page - 1,
      limit: limit,
    };
  }
  results.results = array?.slice(startIndex, endIndex);
  const finalRes = {
    data: results.results || null,
    currentPage: page || 1,
    total: array?.length || 0,
    totalPages: Math.ceil(array?.length / limit),
  };

  return finalRes;
};
