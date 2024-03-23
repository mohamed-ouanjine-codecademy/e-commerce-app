const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const userModel = require('../../models/user.model');
const help = require('../utils');

const localStrategy = new LocalStrategy({
  usernameField: 'email',
}, async (email, password, done) => {
  try {
    const user = await userModel.findUserByEmail(email);
    if (!user || !(await help.comparePassword(password, user.password))) {
      return done(null, false, { message: 'Incorrect email or password.' });
    }
    return done(null, user);
  } catch (error) {
    return done(error);
  }
});

module.exports = localStrategy;