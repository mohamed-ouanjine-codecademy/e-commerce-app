const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const userModel = require('../../models/user.model');

const googleStrategy = new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/api/auth/google/callback',
  scope: ['profile', 'email']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value;
    let user = await userModel.findUserByEmail(email);
    if (!user) {
      user = await userModel.createUserFromGoogleProfile(profile);
    }
    return done(null, user);
  } catch (error) {
    return done(error);
  }
});

module.exports = googleStrategy;