const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const passport = require('passport');
require('dotenv').config();

// Import JWT strategy
passport.use(require('./utils/passport-jwt-strategy'));

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 8000;

// cors
// const corsOptions = {
//   origin: process.env.CLIENT_URL,
//   methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true // allow session cookie from browser to pass through
// };
// Apply middleware
app.use(cors());
app.use(bodyParser.json());
app.use(passport.initialize()); // Initialize Passport middleware
app.use(helmet());

// Mount API routes
const apiRouter = require('./routers');
app.use('/api', apiRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error.';
  res.status(status).json({ error: true, message });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});

module.exports = app;