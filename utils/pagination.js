exports.handlePaginationSort = (query) => {
    let pageNumber = Number(query.pageNumber);
    let limit = Number(query.limit);
    let order = query.order;
    let orderBy = query.orderBy;
  
    if (!pageNumber || pageNumber < 1) {
      pageNumber = 1;
    }
    if (!limit || limit < 1) {
      limit = 10;
    }
    const offset = (pageNumber - 1) * limit;
    if (order == 'ASC' || order == 'asc') {
      order = 'ASC';
    } else {
      order = 'DESC';
    }
    orderBy == null ? (orderBy = 'createdAt') : (orderBy = orderBy);
  
    return { order, offset, orderBy, limit };
  };
  