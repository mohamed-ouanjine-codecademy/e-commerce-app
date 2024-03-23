const express = require('express');
const passport = require('passport');
const router = express.Router();
const userModel = require('../models/user.model');
const help = require('./utils');

// Local strategy
passport.use(require('./utils/passport-local-strategy'));

// Google strategy
passport.use(require('./utils/passport-google-strategy'));

// Register route
router.post('/register', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await help.hashPassword(password);
    const newUser = await userModel.createUserAndCart(email, hashedPassword);
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

// Profile route (protected)
router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { id, firstName, lastName, address } = req.user;
  res.json({ status: 'success', data: { id, firstName, lastName, address } });
});

// Login with password route
router.post('/login/password', passport.authenticate('local', { session: false }), (req, res) => {
  const user = req.user;
  const token = help.createJWT(user);
  res.json({ token });
});

// Google authentication routes
router.get('/google', passport.authenticate('google', { session: false }));
router.get('/google/callback', passport.authenticate('google', { session: false }), (req, res) => {
  res.redirect('http://localhost:3000');
});

// Logout route
router.post('/logout', (req, res) => {
  req.logout();
  res.json({ success: true, message: 'User logged out successfully' });
});

// Check if user is authenticated route
router.get('/is-authenticated', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({ status: 'success', data: { isAuthenticated: true } });
});

// Check email availability route
router.get('/check-email', async (req, res, next) => {
  try {
    const { email } = req.query;
    const isEmailAvailable = await userModel.checkEmailAvailability(email);
    res.json({ isEmailAvailable });
  } catch (err) {
    next(err);
  }
});

module.exports = router;