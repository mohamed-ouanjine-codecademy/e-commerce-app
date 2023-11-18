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

module.exports = {
  hashPassword,
  comparePassword
}