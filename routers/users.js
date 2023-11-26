// imports
const express = require('express');
const router = express.Router();

// -- utils
const db = require('../db/index.js');
const help = require('../helperFunctions.js');

// get all users '/users'
router.get('/', async (req, res, next) => {
  try {
    const users = await db.users.getUsers();

    res.json(users);

  } catch (err) {
    next(err);
  }
});

// get user by id '/users/{userId}'
router.get('/:userId', async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);
    const user = await db.users.getUserById(userId);

    res.json(user);

  } catch (err) {
    next(err);
  }
});

// put user by id '/users/{userId}'
router.put('/:userId', async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);
    const userNewInf = req.body;

    if (userNewInf.password) {
      const password = userNewInf.password;

      const hashedPassword = await help.hashPassword(password);

      userNewInf.password = hashedPassword;
    }

    const updatedUser = await db.users.updateUserById(userId, userNewInf);

    res.json({
      first_name: updatedUser.first_name,
      last_name: updatedUser.last_name,
      email: updatedUser.email,
      address: updatedUser.address
    });

  } catch (err) {
    next(err);
  }
});

router.delete('/:userId', async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);
    
    const deletedUser = await db.users.deleteUserById(userId);

    res.status(200).json({
      message: `${deletedUser.first_name} has been deleted successfully.`
    });

  } catch (err) {
    next(err);
  }
});


module.exports = router;