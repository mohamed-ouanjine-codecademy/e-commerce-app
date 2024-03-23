const { Strategy: JWTStrategy, ExtractJwt } = require('passport-jwt');
const userModel = require('../models/user.model');
require('dotenv').config();

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

const jwtStrategy = new JWTStrategy(options, async (jwtPayload, done) => {
  try {
    const user = await userModel.getUserById(jwtPayload.id);
    if (!user) {
      return done(null, false);
    }
    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
});

module.exports = jwtStrategy;