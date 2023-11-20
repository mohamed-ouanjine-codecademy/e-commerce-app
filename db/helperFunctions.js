const checkExistence = (results, item = 'Element') => {
  if (results.rows.length === 0) {
    const err = new Error(`${item} not found`);
    err.status = 404;
    throw err;
  } else {
    return results.rows[0];
  }
}

module.exports = {
  checkExistence
}