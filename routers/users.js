// imports
const express = require('express');
const router = express.Router();

// -- utils
const users = require('../models/users');
const help = require('../helperFunctions.js');

// get all users '/users'
router.get('/', async (req, res, next) => {
  try {
    const result = await users.getUsers();

    res.json(result);

  } catch (err) {
    next(err);
  }
});

// get user by id '/users/{userId}'
router.get('/:userId', async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);
    const user = await users.getUserById(userId);

    res.json(user);

  } catch (err) {
    next(err);
  }
});

// put user by id '/users/{userId}'
router.put('/:userId', async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);
    const userNewInfo = req.body;

    if (userNewInfo.password) {
      const password = userNewInfo.password;

      const hashedPassword = await help.hashPassword(password);

      userNewInfo.password = hashedPassword;
    }

    const updatedUser = await users.updateUserById(userId, userNewInfo);

    res.json(updatedUser);

  } catch (err) {
    next(err);
  }
});

router.delete('/:userId', async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);

    await users.deleteUserById(userId);

    res.status(204).send();

  } catch (err) {
    next(err);
  }
});


module.exports = router;