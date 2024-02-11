var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local');
const pool = require('../models/database.js');
// -- utils
const db = require('../controllers');
const help = require('../helperFunctions.js');

const router = express.Router();

passport.use(new LocalStrategy({
  usernameField: 'email'
}, async (email, password, cb) => {
  try {
    const client = await pool.connect();

    try {
      // Query to fetch user with the provided email
      const { rows } = await client.query('SELECT * FROM users WHERE email = $1', [email]);

      if (!rows.length) {
        return cb(null, false, { message: 'Incorrect email or password.' });
      }

      const user = rows[0];

      // Hash the provided password using bcrypt (recommended over crypto.pbkdf2)
      const hashedPassword = await help.comparePassword(password, user.password);

      if (!hashedPassword) {
        return cb(null, false, { message: 'Incorrect email or password.' });
      }

      // User authenticated successfully
      return cb(null, user);
    } catch (err) {
      throw err; // Re-throw error for proper handling
    } finally {
      client.release();
    }
  } catch (err) {
    return cb(err);
  }
}));

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    cb(null, user.id);
  });
});

passport.deserializeUser(function (id, cb) {
  process.nextTick(async function () {
    await db.users.findUserById(id, function (err, user) {
      if (err) return cb(err);
      cb(null, user);
    });
  });
});

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

router.post('/register', hashPassword, async (req, res, next) => {
  try {
    const { email } = req.body;
    const password = req.hashedPassword;

    const response = await db.users.createUserAndCart(email, password);
    const newUser = response.user;

    res.status(201).json({
      id: newUser.id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      address: newUser.address,
    });
  } catch (err) {
    next(err);
  }
});

router.get('/profile', (req, res, next) => {
  // Check if user is authenticated
  if (req.isAuthenticated()) {
    // If authenticated, return user's profile data
    const user = req.user;
    return res.json({
      status: 'success',
      data: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        address: user.address
      }
    });
  } else {
    // If not authenticated, return 401 Unauthorized status
    return res.status(401).json({
      status: 'error',
      message: "Unauthorized"
    });
  }
});

router.post('/login/password', passport.authenticate('local', {
  successRedirect: '/api/auth/profile',
  failureRedirect: '/user/login'
}));

router.post('/logout', function (req, res, next) {
  req.logout(function (err) {
    if (err) { return next(err); }
    res.redirect('/api');
  });
});

router.get('/is-authenticated', (req, res, next) => {
  if (req.isAuthenticated()) {
    res.json({
      status: 'success',
      data: {
        isAuthenticated: true
      }
    });
  } else {
    res.status(401).json({
      status: 'error',
      message: 'Unauthorized'
    });
  }
})
router.get('/check-email', async (req, res, next) => {
  try {
    const { email } = req.query;
    const isEmailAvailable = await db.users.checkEmailAvailability(email);

    res.json({ isEmailAvailable });
  } catch (err) {
    next(err);
  }
});

module.exports = router;