const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const utils = {
  // bcrypt
  hashPassword: async (password, roundtime = 10) => {
    try {
      const salt = await bcrypt.genSalt(roundtime);
      return await bcrypt.hash(password, salt);
    } catch (error) {
      throw error;
    }
    return null;
  },

  comparePassword: async (password, hash) => {
    try {
      return await bcrypt.compare(password, hash);
    } catch (error) {
      throw error;
    }
    return false;
  },

  checkAuthentication: (req, res, next) => {
    if (req.isAuthenticated()) {
      req.userId = req.user.id;
      return next();
    }
    res.status(401).json({
      error: true,
      message: 'Unauthorized.'
    });
  },

  createJWT: (user) => {
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET, { expiresIn: '3 days' }
    );
    return token;
  }
}


module.exports = utils;