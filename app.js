const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(bodyParser.json());


app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});

