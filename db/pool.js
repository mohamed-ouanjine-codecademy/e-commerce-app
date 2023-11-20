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

module.exports = pool;