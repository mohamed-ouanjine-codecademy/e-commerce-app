// imports
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

// -- Routers
const usersRouter = require('./routers/users.js');
const productsRouter = require('./routers/products.js');
const cartsRouter = require('./routers/carts.js');
const ordersRouter = require('./routers/orders.js');

// -- utils
const db = require('./db/index.js');
const help = require('./helperFunctions.js');

// Start app
const app = express();
const PORT = process.env.PORT || 3000;

// bodyParser
app.use(bodyParser.json());

// Define Swagger JSdoc options
const options = {
  definition: {
    openapi: '3.0.1',
    info: {
      title: 'My API',
      version: '1.0.0',
    },
  },
  apis: ['./docs/openapi.yaml'], // Specify the path to your route files
};

const specs = swaggerJsdoc(options);

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// session
const store = new session.MemoryStore();
app.use(session({
  secret: process.env.SESSION_SECRET,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true,
    sameSite: "none",
  },
  resave: false,
  saveUninitialized: false,
  store
}));

// passport
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  await db.users.findUserById(id, (err, user) => {
    if (err) return done(err);
    return done(null, user);
  });
});

// mount Routers
app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/carts', cartsRouter);
app.use('/orders', ordersRouter);


// -- passport local strategy
passport.use(new LocalStrategy(
  { usernameField: 'email' },
  async (email, password, done) => {

    await db.users.findUserByEmail(email, async (err, user) => {
      if (err) return done(err);

      if (!user) return done(null, false);

      const validPassword = await help.comparePassword(password, user.password);
      if (!validPassword) return done(null, false);

      return done(null, user);

    });
  }
));

// hashPassword middleware:
const hashPassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    const hashedPassword = await help.hashPassword(password);
    req.hashedPassword = hashedPassword;
    next();
  } catch (error) {
    error.message = 'Server Error';
    next(error);
  }
}

// endpoint: '/register' -> register a new user.
app.post('/register', hashPassword, async (req, res, next) => {
  try {
    const { email } = req.body;
    const userInfo = { email, password: req.hashedPassword };

    const newUser = await db.users.createUser(userInfo);

    res.status(201).json(newUser);
  } catch (err) {
    next(err);
  }
}
);

// endpoint: '/login -> authenticate a user.
app.get('/login', (req, res) => {
  res.send('login page!');
});

// endpoint: '/login -> authenticate a user.
app.post(
  '/login',
  passport.authenticate('local', { failureRedirect: '/login' }),
  (req, res) => {
    res.send(`Welcome back ${req.user.first_name}`);
  }
);

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

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