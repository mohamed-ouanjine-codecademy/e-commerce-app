// imports
const express = require('express');
const bodyParser = require('body-parser');

// -- Routers
const apiRouter = require('./routers');

// Start app
const app = express();
const PORT = process.env.PORT || 8000;

// bodyParser
app.use(bodyParser.json());

// mount Routers
app.use('/api', apiRouter);


// Error middleware
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  const message = err.message;
  res.status(status).send(message);
});

app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});

module.exports = app;