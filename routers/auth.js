const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const pool = require('../models/database.js');
const Users = require('../models/users');
const help = require('../helperFunctions.js');

const router = express.Router();

// Local strategy
passport.use(new LocalStrategy({
  usernameField: 'email'
}, async (email, password, cb) => {
  try {
    const client = await pool.connect();
    const { rows } = await client.query('SELECT * FROM users WHERE email = $1', [email]);

    if (!rows.length) {
      return cb(null, false, { message: 'Incorrect email or password.' });
    }

    const user = rows[0];
    const hashedPassword = await help.comparePassword(password, user.password);

    if (!hashedPassword) {
      return cb(null, false, { message: 'Incorrect email or password.' });
    }

    return cb(null, user);
  } catch (err) {
    return cb(err);
  }
}));

// Google strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/api/auth/google/redirect',
  scope: ['profile', 'email']
}, async (accessToken, refreshToken, profile, cb) => {
  try {
      const email = profile.emails[0].value;
      const currentUser = await Users.findUserByEmail(email);

      if (!currentUser) {
          const newUser = await Users.createUserFromGoogleProfile(profile);
          return cb(null, newUser);
      } else {
          return cb(null, currentUser);
      }
  } catch (err) {
      return cb(err);
  }
}));

passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser(async (id, cb) => {
  try {
    const user = await Users.findUserById(id);
    cb(null, user);
  } catch (err) {
    cb(err);
  }
});

// hashPassword middleware:
const hashPassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    const hashedPassword = await help.hashPassword(password);
    req.hashedPassword = hashedPassword;
    next();
  } catch (error) {
    next(new Error('Server Error'));
  }
};

router.post('/register', hashPassword, async (req, res, next) => {
  try {
    const { email } = req.body;
    const password = req.hashedPassword;
    const response = await Users.createUserAndCart(email, password);
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
  if (req.isAuthenticated()) {
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

// Google endpoints
// when login is successful, retrieve user info
router.get("/login/success", (req, res) => {
  if (req.user) {
    res.json({
      success: true,
      message: "user has successfully authenticated",
      user: req.user,
      cookies: req.cookies
    });
  }
});

// when login failed, send failed msg
router.get("/login/failed", (req, res) => {
  res.status(401).json({
    success: false,
    message: "user failed to authenticate."
  });
});


// auth with twitter
router.get("/google", passport.authenticate("google", { scope: ['profile', 'email'] }));

// redirect to home page after successfully login via twitter
router.get(
  "/google/redirect",
  passport.authenticate("google", {
    successRedirect: process.env.CLIENT_HOME_PAGE_URL,
    failureRedirect: "login/failed"
  })
);

router.post('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) {
      console.error(err);
      err.message = 'Logout failed';
      next(err);
    }
    res.json({
      success: true,
      message: 'user loged out successfully'
    });
  });
});


router.get('/is-authenticated', (req, res) => {
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
});

router.get('/check-email', async (req, res, next) => {
  try {
    const { email } = req.query;
    const isEmailAvailable = await Users.checkEmailAvailability(email);
    res.json({ isEmailAvailable });
  } catch (err) {
    next(err);
  }
});

module.exports = router;