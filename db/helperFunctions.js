const checkExistence = (results, item = 'Element') => {
  if (results.rowCount === 0) {
    const err = new Error(`No such ${item} has been founded.`);
    err.status = 404;
    throw err;
  } else {
    return results.rows[0];
  }
}

// Function to recursively change keys
function changeKeys(obj, oldKey, newKey) {
  if (obj instanceof Array) {
      obj.forEach((item) => {
          changeKeys(item, oldKey, newKey);
      });
  } else if (obj instanceof Object) {
      Object.keys(obj).forEach((key) => {
          const value = obj[key];
          if (key === oldKey) {
              delete obj[key];
              obj[newKey] = value;
          }
          changeKeys(value, oldKey, newKey);
      });
  }
}

module.exports = {
  checkExistence,
  changeKeys
}