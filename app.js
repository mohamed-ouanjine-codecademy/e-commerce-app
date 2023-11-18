const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const db = require('./db/index.js');
const help = require('./helperFunctions.js');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(bodyParser.json());

// hashPassword middleware:
const hashPassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    const hashedPassword = await help.hashPassword(password);
    req.hashedPassword = hashedPassword;
    next();
  } catch (error) {
    console.error('Error in hashPassword middleware:', error);
    error.message = 'Server Error';
    next(error);
  }
}

// endpoint: '/signup' -> regestring a new user.
app.post('/signup', hashPassword, db.users.createUser);

// endpoint: '/signin -> authenticate a user.
app.post('/signin', (req, res, next) => {

});


// Error middleware
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message;

  res.status(status).send(message);
})

app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});

