const bcrypt = require('bcrypt')

// bcrypt
const hashPassword = async (password, roundtime = 10) => {
  try {
    const salt = await bcrypt.genSalt(roundtime);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    throw error;
  }
  return null;
}

const comparePassword = async (password, hash) => {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    throw error;
  }
  return false;
}

const checkAuthentication = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({
    error: true,
    message: 'Unauthorized'
  });
}

module.exports = {
  hashPassword,
  comparePassword,
  checkAuthentication
}