const pool = require('./pool.js');
const help = require('./helperFunctions.js');

const users = {
  createUser: (req, res, next) => {
    const { email } = req.body;
    const hashedPassword = req.hashedPassword;
    pool.query('INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *', [email, hashedPassword], (err, results) => {
      if (err) {
        console.err('err in createUser', err);
        next(err);
      }
      res.status(201).json(results.rows[0]);
    })
  },

  findUserByEmail: async (email, callback) => {
    try {
      const results = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      callback(null, results.rows[0]);
    } catch (err) {
      callback(err)
      throw err
    }
  },

  findUserById: async (id, callback) => {
    try {
      const results = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
      return callback(null, results.rows[0]);
    } catch (err) {
      return callback(err);
    }
  }
}

module.exports = users;