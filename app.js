// imports
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// -- Routers
const usersRouter = require('./routers/users.js');
const productsRouter = require('./routers/products.js');

// -- utils
const db = require('./db/index.js');
const help = require('./helperFunctions.js');

// Start app
const app = express();
const PORT = process.env.PORT || 4000;

// bodyParser
app.use(bodyParser.json());

// mount Routers
app.use('/users', usersRouter);
app.use('/products', productsRouter);

// session
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));

// passport
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  db.users.findUserById(id, (err, user) => {
    if (err) return done(err);
    return done(null, user);
  });
});

// -- passport local strategy
passport.use(new LocalStrategy(
  { usernameField: 'email' },
  async (email, password, done) => {

    db.users.findUserByEmail(email, async (err, user) => {
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
    console.error('Error in hashPassword middleware:', error);
    error.message = 'Server Error';
    next(error);
  }
}

// endpoint: '/signup' -> register a new user.
app.post('/signup', hashPassword, db.users.createUser);

// endpoint: '/signin -> authenticate a user.
app.get('/signin', (req, res) => {
  res.send('signin page!');
});

// endpoint: '/signin -> authenticate a user.
app.post(
  '/signin',
  passport.authenticate('local', { failureRedirect: '/signin' }),
  (req, res) => {
    res.send(`Welcome back`);
  }
);

// Error middleware
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message;
  // console.error(err);
  res.status(status).send(message);
});

app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});
