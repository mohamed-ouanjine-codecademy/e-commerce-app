// imports
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const router = require('express').Router();

// -- Routers
const usersRouter = require('./users.js');
const productsRouter = require('./products.js');
const cartsRouter = require('./carts.js');
const ordersRouter = require('./orders.js');

// -- utils
const db = require('../controllers');
const help = require('../helperFunctions.js');

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
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// session
const store = new session.MemoryStore();
router.use(session({
  secret: process.env.SESSION_SECRET,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
    // httpOnly: true,
    sameSite: "none",
  },
  resave: false,
  saveUninitialized: false,
  sameSite: 'none',
  store
}));

// passport
router.use(passport.initialize());
router.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  await db.users.findUserById(id, (err, user) => {
    if (err) return done(err);
    return done(null, user);
  });
});

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

// mount routers
router.use('/users', usersRouter);
router.use('/products', productsRouter);
router.use('/carts', cartsRouter);
router.use('/orders', ordersRouter);

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
// root path
router.get('/', (req, res) => {
  if (req.user) {
    return res.json({user: req.user});
  }
  return res.send('Hello, this is your Express server!');
});

router.get('/check-email', async (req, res, next) => {
  try {
    const { email } = req.query;
    const isEmailAvailable = await db.users.checkEmailAvailability(email);

    res.json({ isEmailAvailable });
  } catch (err) {
    next(err);
  }
});

router.post('/register', hashPassword, async (req, res, next) => {
  try {
    const { email } = req.body;
    const password  = req.hashedPassword;
    const userInfo = { email, password };

    const newUser = await db.users.createUser(userInfo);

    res.status(201).json(newUser);
  } catch (err) {
    next(err);
  }
}
);

// endpoint: '/login -> authenticate a user.
router.get('/sign-in', (req, res) => {
  res.status(401).json({ message: 'Failed to sign in. Please check your credentials.' });
});

// endpoint: '/login -> authenticate a user.
router.post(
  '/sign-in',
  passport.authenticate('local', { failureRedirect: '/api/sign-in' }),
  (req, res) => {
    res.status(200).json(req.user);
  }
);

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;