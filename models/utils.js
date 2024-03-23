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
const convertKeysFromSnakeCaseToCamelCase = (obj) => {
  if (!obj || typeof obj !== 'object') {
    throw new Error('Invalid input. Please provide a valid object or array.');
  }

  if (Array.isArray(obj)) {
    return obj.map(item => {
      if (typeof item === 'object') {
        return convertKeysFromSnakeCaseToCamelCase(item);
      } else {
        return item; // Return the item unchanged if it's not an object
      }
    });
  }

  const transformed = {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const camelCaseKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      const value = obj[key];

      if (value !== null && typeof value === 'object') {
        transformed[camelCaseKey] = convertKeysFromSnakeCaseToCamelCase(value);
      } else {
        transformed[camelCaseKey] = value;
      }
    }
  }

  return transformed;
};

// Function to convert keys to snake_case
const convertKeysFromCamelCaseToSnakeCase = (obj) => {
  if (!obj || typeof obj !== 'object') {
    throw new Error('Invalid input. Please provide a valid object or array.');
  }

  if (Array.isArray(obj)) {
    return obj.map(item => {
      if (typeof item === 'object') {
        return convertKeysFromCamelCaseToSnakeCase(item);
      } else {
        return item; // Return the item unchanged if it's not an object
      }
    });
  }
  

  const snakeCaseObj = {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const snakeCaseKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
      snakeCaseObj[snakeCaseKey] = obj[key];
    }
  }

  return snakeCaseObj;
};

class MyError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.status = statusCode || 500;
  }
}

class NotFound extends Error {
  constructor(item) {
    super(`No such ${item} has been founded.`);
    this.status = 404;
  }
}

const buildInsertQuery = (items) => {
  items = convertKeysFromCamelCaseToSnakeCase(items);
  const insertQuery = [];
  const values = [];
  let placeholderIndex = 1;

  for (const item of items) {
    const subQueryValues = [];

    for (const key in item) {
      subQueryValues.push(item[key]);
      values.push(item[key]);
    }

    const placeholders = subQueryValues.map((_, index) => `$${placeholderIndex + index}`).join(', ');
    insertQuery.push(`(${placeholders})`);
    placeholderIndex += subQueryValues.length;
  }

  const columns = Object.keys(items[0]).join(', ');

  return { columns, insertQuery, values };
};

const prepareUpdateFields = (obj, columns) => {
  obj = convertKeysFromCamelCaseToSnakeCase(obj);
  const updateFields = [];
  const values = [];
  let fieldsCount = 1;

  // Iterate over the keys of obj
  for (const column of columns) {
      // Check if the key is not inherited from the prototype chain
      if (obj.hasOwnProperty(column)) {
          updateFields.push(`${column} = $${fieldsCount}`);
          values.push(obj[column]);
          fieldsCount++;
      }
  }
  return { updateFields: updateFields.join(', '), values, fieldsCount };
}


module.exports = {
  checkExistence,
  convertKeysFromSnakeCaseToCamelCase,
  convertKeysFromCamelCaseToSnakeCase,
  MyError,
  NotFound,
  buildInsertQuery,
  prepareUpdateFields
}