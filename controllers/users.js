const pool = require('../models/database.js');
const help = require('./helperFunctions.js');
const carts = require('./carts.js');

const users = {
  createUser: async function (client, userInfo) {
    const shouldRelease = client ? false : true;
    try {
      if (shouldRelease) {
        client = await pool.connect();
      }

      if (!userInfo.email || !userInfo.password) {
        throw new Error('Invalid input data');
      }

      shouldRelease && await client.query('BEGIN');

      // Check email availability
      const isEmailAvailable = await this.checkEmailAvailability(userInfo.email);
      console.log(isEmailAvailable);
      if (isEmailAvailable === false) {
        throw new Error('Email is not available');
      }

      // Register user
      const results = await client.query(`
        INSERT INTO users (email, password) VALUES
          ($1, $2)
        RETURNING *`,
        [userInfo.email, userInfo.password]);

      shouldRelease && await client.query('COMMIT');

      const newUser = results.rows[0];
      return help.transformKeys(newUser);

    } catch (err) {
      shouldRelease && await client.query('ROLLBACK');
      throw err;
    } finally {
      shouldRelease && client.release();
    }
  },

  createUserAndCart: async function (userEmail, userPassword) {
    const client = await pool.connect();
    try {

      await client.query('BEGIN');
      // Create user.
      const newUser = await this.createUser(client, {
        email: userEmail, password: userPassword
      });
      // Create a cart for the user.
      const newCart = await carts.createCart(client, newUser.id);

      await client.query('COMMIT');

      const response = help.transformKeys({
        user: newUser,
        cart: newCart
      });

      return response;

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;

    } finally {
      client.release();
    }
  },

  checkEmailAvailability: async function (email) {
    try {
      if (!email) {
        throw new Error('Invalid input data');
      }

      const results = await pool.query(`
        SELECT *
        FROM users
        WHERE email = $1;`,
        [email]);

      return results.rows.length === 0;

    } catch (err) {
      throw err;
    }
  },

  findUserByEmail: async function (email, callback) {
    try {
      if (!email) {
        throw new Error('Invalid input data');
      }

      const results = await pool.query(`
        SELECT *
        FROM users
        WHERE email = $1;`,
        [email]);

      const user = help.checkExistence(results, 'User');
      callback(null, help.transformKeys(user));

    } catch (err) {
      callback(err)
      throw err;
    }
  },

  findUserById: async function (id, callback) {
    try {
      if (!id) {
        throw new Error('Invalid input data');
      }

      const results = await pool.query(`
        SELECT *
        FROM users
        WHERE id = $1;`,
        [id]);

      return callback(null, results.rows[0]);

    } catch (err) {
      callback(err);
      throw err;
    }
  },

  getUsers: async function () {
    try {
      const results = await pool.query(`
      SELECT *
      FROM users;`);

      const users = results.rows;

      return help.transformKeys(users);

    } catch (err) {
      throw err;
    }
  },

  getUserById: async function (userId) {
    try {
      if (!(typeof userId === 'number')) {
        throw new Error('Invalid input data');
      }

      const results = await pool.query(`
        SELECT *
        FROM users
        WHERE id = $1;`,
        [userId]
      );

      const user = help.checkExistence(results, 'User');

      return help.transformKeys(user);

    } catch (err) {
      throw err;
    }
  },

  updateUserById: async function (userId, userNewInfo) {
    try {
      // check if the user exist
      await this.getUserById(userId);

      if (!(typeof userId === 'number') || !userNewInfo) {
        throw new Error('Invalid input data');
      }

      // set up.
      const updateFields = [];
      const values = [];
      const keys = ['firstName', 'lastName', 'email', 'address', 'password'];
      const databaseKeys = ['first_name', 'last_name', 'email', 'address', 'password'];
      let fieldsCount = 1;

      // check if the users's keys that will be updated (e.g. first_name, last_name...)
      for (let i = 0; i < keys.length; i++) {
        if (userNewInfo[keys[i]]) {
          updateFields.push(`${databaseKeys[i]} = $${fieldsCount}`);
          values.push(userNewInfo[keys[i]]);
          fieldsCount++;
        }
      }
      values.push(userId);

      // check if there something to updated and updated it in database
      if (updateFields.length > 0) {
        const results = await pool.query(`
          UPDATE users
          SET ${updateFields.join(', ')}
          WHERE id = $${fieldsCount}
          RETURNING *;`,
          values
        );

        const updatedUser = results.rows[0];

        return help.transformKeys(updatedUser);
      }

    } catch (err) {
      throw err;
    }
  },

  deleteUserById: async function (userId) {
    try {
      // check if the user exist
      await this.getUserById(userId);

      // check the input data
      if (!(typeof userId === 'number')) {
        throw new Error('Invalid input data');
      }

      // delete user from database
      const results = await pool.query(`
        DELETE FROM users
        WHERE id = $1
        RETURNING *;`,
        [userId]
      );
      const deletedUser = results.rows[0];

      return help.transformKeys(deletedUser);

    } catch (err) {
      throw err;
    }
  },

  helpers: {
    changeUserKeys: function (user) {
      help.changeKeys(user, 'first_name', 'firstName');
      help.changeKeys(user, 'last_name', 'lastName');
    }
  }
}

module.exports = users;