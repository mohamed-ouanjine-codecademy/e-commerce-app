const pool = require('./pool.js');
const help = require('./helperFunctions.js');

const users = {
  createUser: async function (userInf) {
    try {
      if (!userInf[0] || !userInf[1]) {
        throw new Error('Invalid input data');
      }

      const results = await pool.query(`
        INSERT INTO users (email, password) VALUES
          ($1, $2)
        RETURNING *`,
        userInf);

      return results.rows[0];

    } catch (err) {
      console.error(err);
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

      callback(null, user);

    } catch (err) {
      callback(err)
      throw err
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
      console.error(err);
      throw err;
    }
  },

  getUsers: async function () {
    try {
      const results = await pool.query(`
      SELECT *
      FROM users;`);

      return results.rows;

    } catch (err) {
      console.error(err);
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

      return user;

    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  updateUserById: async function (userId, userNewInf) {
    try {
      // check if the user exist
      await this.getUserById(userId);

      if (!(typeof userId === 'number') || !userNewInf) {
        throw new Error('Invalid input data');
      }

      // set up.
      const updateFields = [];
      const values = [];
      const keys = ['first_name', 'last_name', 'email', 'address', 'password'];
      let fieldsCount = 1;

      // check if the users's keys that will be updated (e.g. first_name, last_name...)
      for (let key of keys) {
        if (userNewInf[key]) {
          updateFields.push(`${key} = $${fieldsCount}`);
          values.push(userNewInf[key]);
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

        return results.rows[0];
      }

    } catch (err) {
      console.error(err);
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

      return results.rows[0];

    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}

module.exports = users;