const router = require('express').Router();
const userController = require('../controllers/user.controller');

router.get('/', userController.getUsers);
router.get('/:userId', userController.getUserById);
router.put('/:userId', userController.updateUserById);
router.delete('/:userId', userController.deleteUserById);

module.exports = router;