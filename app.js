const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const { pool } = require('./db/index.js');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(bodyParser.json());


// routes just to test
app.get('/users', (req, res) => {
  pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })
});

app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});

