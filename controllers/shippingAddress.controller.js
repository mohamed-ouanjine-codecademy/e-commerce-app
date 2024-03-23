const shippingAddressModel = require('../models/shippingAddress.model');

const shippingAddressesController = {
  createShippingAddress: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const shippingAddressInfo = req.body;
      const newShippingAddress = await shippingAddressModel.createShippingAddress(userId, shippingAddressInfo);

      res.status(201).json({
        status: 'successful',
        message: 'Shipping address created successfully',
        data: newShippingAddress
      });
    } catch (error) {
      next(error);
    }
  },

  getShippingAddressesByUserId: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const shippingAddresses = await shippingAddressModel.getShippingAddressesByUserId(userId);

      res.status(200).json({
        status: 'successful',
        message: 'Shipping addresses retrieved successfully',
        data: shippingAddresses
      });
    } catch (error) {
      next(error);
    }
  },

  editShippingAddressByUserId: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const shippingAddressId = parseInt(req.params.shippingAddressId);
      const newShippingAddressInfo = req.body;
      const updatedShippingAddress = await shippingAddressModel.editShippingAddressByUserId(userId, shippingAddressId, newShippingAddressInfo);

      res.status(200).json({
        status: 'successful',
        message: 'Shipping Address updated successfully',
        data: updatedShippingAddress
      });
    } catch (error) {
      next(error);
    }
  },

  deleteShippingAddressByUserId: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const shippingAddressId = parseInt(req.params.shippingAddressId);
      await shippingAddressModel.deleteShippingAddressByUserId(userId, shippingAddressId);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

module.exports = shippingAddressesController;