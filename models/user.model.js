const pool = require('./database.js');
const help = require('./utils.js');
const carts = require('./cart.model.js');

const userModel = {
  // create new user with the given info
  createUser: async function (userInfo, client) {
    const isClientDefined = client ? true : false;
    try {
      if (!isClientDefined) client = await pool.connect();

      if (typeof userInfo !== 'object') {
        throw new help.MyError('Invalid input data', 400);
      }

      !isClientDefined && await client.query('BEGIN');

      // Check email availability
      const isEmailAvailable = await this.checkEmailAvailability(userInfo.email, client);
      if (isEmailAvailable === false) throw new Error('Email is not available');

      const { columns, insertQuery, values } = help.buildInsertQuery(userInfo);
      // Register user
      const results = await client.query(`
        INSERT INTO users ${columns} VALUES
          ${insertQuery}
        RETURNING first_name, last_name, email, address`,
        values
      );

      !isClientDefined && await client.query('COMMIT');

      const newUser = help.convertKeysFromSnakeCaseToCamelCase(results.rows[0]);
      return newUser;

    } catch (error) {
      !isClientDefined && await client.query('ROLLBACK');
      throw error;

    } finally {
      !isClientDefined && client.release();
    }
  },

  async createUserFromGoogleProfile(profile, client) {
    const isClientDefined = client ? true : false;

    try {
      if (!isClientDefined) client = await pool.connect();
      const email = profile.emails[0].value;
      const { givenName: firstName, familyName: lastName } = profile.name;
      const authSource = profile.provider;

      !isClientDefined && await client.query('BEGIN');
      const results = await pool.query(
        `
        INSERT INTO users (email, first_name, last_name, auth_source) 
        VALUES ($1, $2, $3, $4)
        RETURNING *;
        `,
        [email, firstName, lastName, authSource]
      );
      !isClientDefined && await client.query('COMMIT');
      const newUser = help.convertKeysFromSnakeCaseToCamelCase(results.rows[0]);

      return newUser;
    } catch (error) {
      !isClientDefined && await client.query('ROLLBACK');
      throw error;
    } finally {
      !isClientDefined && client.release();
    }
  },

  checkEmailAvailability: async function (email, client) {
    const isClientDefined = client ? true : false;
    try {
      if (!isClientDefined) client = await pool.connect();

      // check input data.
      if (!email) throw new help.MyError('Invalid input data', 400);

      !isClientDefined && await client.query('BEGIN');

      const results = await client.query(`
        SELECT *
        FROM users
        WHERE email = $1;`,
        [email]);

      !isClientDefined && await client.query('COMMIT');

      // see if there is no matching email.
      return results.rows.length === 0;

    } catch (error) {
      !isClientDefined && await client.query('ROLLBACK');
      throw error;

    } finally {
      !isClientDefined && client.release();
    }
  },

  findUserByEmail: async function (email, client) {
    const isClientDefined = client ? true : false;
    try {
      if (!isClientDefined) client = await pool.connect();

      // check input data.
      if (!email) throw new help.MyError('Invalid input data', 400);

      !isClientDefined && await client.query('BEGIN');

      const results = await pool.query(`
        SELECT *
        FROM users
        WHERE email = $1;`,
        [email]
      );
      if (results.rows.length === 0) throw new help.NotFound('user');

      !isClientDefined && await client.query('COMMIT');

      const user = help.convertKeysFromSnakeCaseToCamelCase(results.rows[0]);
      return user;

    } catch (error) {
      !isClientDefined && await client.query('ROLLBACK');
      throw error;

    } finally {
      !isClientDefined && client.release();
    }
  },

  getUsers: async function (client) {
    const isClientDefined = client ? true : false;
    try {
      if (!isClientDefined) client = await pool.connect();

      !isClientDefined && await client.query('BEGIN');
      const results = await pool.query(`
      SELECT first_name, last_name, email, address
      FROM users;`);
      !isClientDefined && await client.query('COMMIT');

      const users = help.convertKeysFromSnakeCaseToCamelCase(results.rows);
      return users;

    } catch (error) {
      !isClientDefined && await client.query('ROLLBACK');
      throw error;
    }
  },

  getUserById: async function (userId, client) {
    const isClientDefined = client ? true : false;
    try {
      if (!isClientDefined) client = await pool.connect();
      if (!(typeof userId === 'number')) {
        throw new Error('Invalid input data');
      }
      !isClientDefined && await client.query('BEGIN');
      const results = await pool.query(`
        SELECT id, first_name, last_name, email, address
        FROM users
        WHERE id = $1;`,
        [userId]
      );
      !isClientDefined && await client.query('COMMIT');
      const user = help.convertKeysFromSnakeCaseToCamelCase(results.rows[0]);

      return user;
    } catch (error) {
      !isClientDefined && await client.query('ROLLBACK');
      throw error;
    } finally {
      !isClientDefined && client.release();
    }
  },

  updateUserById: async function (userId, userNewInfo, client) {
    const isClientDefined = client ? true : false;
    try {
      if (!isClientDefined) client = await pool.connect();

      // check if the user exist
      await this.getUserById(userId, client);

      if (!(typeof userId === 'number') || !userNewInfo) {
        throw new Error('Invalid input data');
      }

      const columns = ['first_name', 'last_name', 'address']
      const { updateFields, values, fieldsCount } = help.prepareUpdateFields(userNewInfo, columns);
      values.push(userId);

      // check if there something to updated and updated it in database
      !isClientDefined && await client.query('BEGIN');
      const results = await pool.query(`
        UPDATE users
        SET ${updateFields}
        WHERE id = $${fieldsCount}
        RETURNING *;`,
        values
      );
      !isClientDefined && await client.query('COMMIT');

      const updatedUser = help.convertKeysFromSnakeCaseToCamelCase(results.rows[0]);
      return updatedUser;

    } catch (error) {
      !isClientDefined && await client.query('ROLLBACK');
      throw error;
    } finally {
      !isClientDefined && client.release();
    }
  },

  deleteUserById: async function (userId, client) {
    const isClientDefined = client ? true : false;
    try {
      if (!isClientDefined) client = await pool.connect();

      // check the input data
      if (!(typeof userId === 'number')) throw new help.MyError('Invalid input data');

      !isClientDefined && await client.query('BEGIN');
      const results = await pool.query(`
        DELETE FROM users
        WHERE id = $1;`,
        [userId]
      );
      if (results.rowCount === 0) throw new help.NotFound('user');
      !isClientDefined && await client.query('COMMIT');

    } catch (error) {
      !isClientDefined && await client.query('ROLLBACK');
      throw error;
    } finally {
      !isClientDefined && client.release();
    }
  }
}

module.exports = userModel;