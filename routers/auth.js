const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const Users = require('../models/users');
const help = require('../utils');

const router = express.Router();

// Local strategy
passport.use(new LocalStrategy({
  usernameField: 'email'
}, async (email, password, cb) => {
  try {
    const user = await Users.findUserByEmail(email);
    if (!user || !(await help.comparePassword(password, user.password))) {
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
  callbackURL: '/api/auth/google/callback',
  scope: ['profile', 'email']
}, async (accessToken, refreshToken, profile, cb) => {
  try {
    const email = profile.emails[0].value;
    let user = await Users.findUserByEmail(email);
    if (!user) {
      user = await Users.createUserFromGoogleProfile(profile);
    }
    return cb(null, user);
  } catch (err) {
    return cb(err);
  }
}));

passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser(async (id, cb) => {
  try {
    const user = await Users.getUserById(id);
    cb(null, user);
  } catch (err) {
    cb(err);
  }
});

// Middleware for hashing password
const hashPassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    req.hashedPassword = await help.hashPassword(password);
    next();
  } catch (error) {
    next(new Error('Server Error'));
  }
};

// Register route
router.post('/register', hashPassword, async (req, res, next) => {
  try {
    const { email, hashedPassword } = req;
    const newUser = await Users.createUserAndCart(email, hashedPassword);
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

// Profile route
router.get('/profile', (req, res) => {
  if (req.isAuthenticated()) {
    const { id, firstName, lastName, address } = req.user;
    res.json({
      status: 'success',
      data: { id, firstName, lastName, address }
    });
  } else {
    res.status(401).json({ status: 'error', message: 'Unauthorized' });
  }
});

// Login with password route
router.post('/login/password', passport.authenticate('local'), (req, res) => {
  res.redirect('/api/auth/profile');
});

// Google authentication routes
router.get('/google', passport.authenticate('google'));

router.get('/google/callback', passport.authenticate('google', {
  failureRedirect: '/api/auth/login/failed'
}), (req, res) => {
  res.redirect('http://localhost:3000');
});

// Logout route
router.post('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) {
      console.error(err);
      err.message = 'Logout failed';
      next(err);
    }
  });
  res.json({ success: true, message: 'User logged out successfully' });
});

// Check if user is authenticated route
router.get('/is-authenticated', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ status: 'success', data: { isAuthenticated: true } });
  } else {
    res.status(401).json({ status: 'error', message: 'Unauthorized' });
  }
});

// Check email availability route
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
