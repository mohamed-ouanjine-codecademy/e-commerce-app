const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUserById,
  updateUserById,
  deleteUserById
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUserById);
router.put('/:userId', updateUserById);
router.delete('/:userId', deleteUserById);

module.exports = router;