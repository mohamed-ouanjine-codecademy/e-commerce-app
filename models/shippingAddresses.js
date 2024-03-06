const pool = require('./database.js');
const help = require('./helperFunctions.js');

const shippingAddresses = {
  // Create new shipping address
  createShippingAddress: async (userId, shippingAddressInfo) => {
    try {
      // Check input data
      const { name, street, city, state, postalCode, country } = shippingAddressInfo;
      if (
        typeof userId !== 'number' ||
        typeof name !== 'string' ||
        typeof street !== 'string' ||
        typeof city !== 'string' ||
        typeof state !== 'string' ||
        typeof postalCode !== 'string' ||
        typeof country !== 'string'
      ) help.error('Invalid Input Data!', 400);

      // Create new shipping address
      const results = await pool.query(
        `
        INSERT INTO shipping_addresses (name, street, city, state, postal_code, country, user_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id, name, street, city, state, postal_code, country;
        `,
        [name, street, city, state, postalCode, country, userId]
      );
      const shippingAddress = help.transformKeys(results.rows[0]);
      return shippingAddress;
    } catch (error) {
      throw error;
    }
  },

  // Get all shipping addresses (related to a user)
  getShippingAddressesByUserId: async (userId) => {
    try {
      // Check input data
      if (typeof userId !== 'number') help.error('User ID must be a number!', 400);

      // Get shipping addresses
      const results = await pool.query(
        `
        SELECT id, name, street, city, state, postal_code, country
        FROM shipping_addresses
        WHERE user_id = $1;
        `,
        [userId]
      );

      if (results.rows.length === 0) help.error('No shipping addresses found for the user', 404);

      const shippingAddresses = help.transformKeys(results.rows);
      return shippingAddresses;
    } catch (error) {
      throw error;
    }
  },

  // Edit shipping address
  editShippingAddressByUserId: async (userId, shippingAddressId, newShippingAddressInfo) => {
    try {
      // Check input data
      if (
        typeof userId !== 'number' ||
        typeof shippingAddressId !== 'number' ||
        typeof newShippingAddressInfo !== 'object'
      ) help.error('Invalid Input Data!', 400);

      // Build update query dynamically
      newShippingAddressInfo = help.convertKeysToSnakeCase(newShippingAddressInfo);
      const updateQuery = [];
      const values = [];
      let placeholderIndex = 1;
      for (const key in newShippingAddressInfo) {
        updateQuery.push(`${key} = $${placeholderIndex}`);
        values.push(newShippingAddressInfo[key]);
        placeholderIndex++;
      }
      values.push(userId, shippingAddressId);

      // Update shipping address
      const results = await pool.query(
        `
        UPDATE shipping_addresses
        SET ${updateQuery.join(', ')}
        WHERE user_id = $${placeholderIndex}
          AND id = $${placeholderIndex + 1}
        RETURNING id, name, street, city, state, postal_code, country;
        `,
        values
      );

      if (results.rowCount === 0) help.error('Shipping address not found for the user', 404);

      const newShippingAddress = help.transformKeys(results.rows[0]);
      return newShippingAddress;
    } catch (error) {
      throw error;
    }
  },

  // Delete shipping address by its id and user's id
  deleteShippingAddressByUserId: async (userId, shippingAddressId) => {
    try {
      // Check input data
      if (
        typeof userId !== 'number' ||
        typeof shippingAddressId !== 'number'
      ) help.error('Invalide input data', 400);

      // DELETE shipping address
      const results = await pool.query(
        `
        DELETE FROM shipping_addresses
        WHERE id = $1
          AND user_id = $2;
        `,
        [shippingAddressId, userId]
      );

      if (results.rowCount === 0) help.error('Shipping address not found for the user', 404);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = shippingAddresses;