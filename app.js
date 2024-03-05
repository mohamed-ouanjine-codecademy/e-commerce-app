const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const PgSession = require('connect-pg-simple')(session);
const pool = require('./models/database');
require('dotenv').config(); // Load environment variables from .env file

// -- Routers
const apiRouter = require('./routers');

// Start app
const app = express();
const PORT = process.env.PORT || 8000;

// bodyParser
app.use(bodyParser.json());

// Session configuration with Postgres store
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: new PgSession({
    pool,
  }),
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days
}));
app.use(passport.authenticate('session'));

// mount Routers
app.use('/api', apiRouter);

// Error middleware
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  const message = err.message;
  res.status(status).json({
    status: 'error',
    message
  });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});

module.exports = app;