const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool(
  {
    user: 'me',
    host: 'localhost',
    database: 'e-commerce_app',
    password: process.env.ROLE_PASSWORD,
    port: 5432
  }
);

const users = {
  createUser : (req, res, next) => {
    const { email } = req.body;
    const hashedPassword = req.hashedPassword;
    console.log(`hashedPassword: ${hashedPassword} -- at db/index.js`);
    pool.query('INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *', [email, hashedPassword], (error, results) => {
      if (error) {
        console.error('Error in createUser', error);
        next(error);
      }
      res.status(201).json(results.rows[0]);
      console.log(`results: ${results.rows[0]}`);
    })
  }
}

module.exports = {
  pool,
  users
}
