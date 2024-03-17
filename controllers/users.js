const userModel = require('../models/users');

const userController = {
  // Get all users
  getUsers: async (req, res, next) => {
    try {
      const users = await userModel.getUsers();
      res.json({
        success: true,
        message: 'Users retrieved successfully.',
        data: { users }
      });
    } catch (err) {
      next(err);
    }
  },

  // Get user by ID
  getUserById: async (req, res, next) => {
    try {
      const userId = parseInt(req.params.userId);
      const user = await userModel.getUserById(userId);
      res.json({
        success: true,
        message: 'User retrieved successfully.',
        data: { user }
      });
    } catch (err) {
      next(err);
    }
  },

  // Update user by ID
  updateUserById: async (req, res, next) => {
    try {
      const userId = parseInt(req.params.userId);
      const userNewInfo = req.body;
      const updatedUser = await userModel.updateUserById(userId, userNewInfo);
      res.json({
        success: true,
        message: 'User updated successfully.',
        data: { user: updatedUser }
      });
    } catch (err) {
      next(err);
    }
  },

  // Delete user by ID
  deleteUserById: async (req, res, next) => {
    try {
      const userId = parseInt(req.params.userId);
      await userModel.deleteUserById(userId);
      res.status(204).json({
        success: true,
        message: 'User deleted successfully.'
      });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = userController;