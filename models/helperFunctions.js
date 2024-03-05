const checkExistence = (results, item = 'Element') => {
  if (results.rowCount === 0) {
    const err = new Error(`No such ${item} has been founded.`);
    err.status = 404;
    throw err;
  } else {
    return results.rows[0];
  }
}

// Function to convert keys to camelCase
const transformKeys = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(item => transformKeys(item));
  } else if (obj !== null && typeof obj === 'object') {
    const transformed = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const camelCaseKey = key.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
        transformed[camelCaseKey] = transformKeys(obj[key]);
      }
      if (obj[key] !== null && typeof obj[key] === 'object') {
        transformed[key] = transformKeys(obj[key]);
      }
    }
    return transformed;
  } else {
    return obj;
  }
}

const error = (message, status) => {
  const error = new Error(message);
  error.status = status;
  throw error;
}

module.exports = {
  checkExistence,
  transformKeys,
  error
}