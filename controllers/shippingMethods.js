const ShippingMethods = require('../models/shippingMethods');

const shippingMethodsController = {
  getShippingMethods: async (req, res, next) => {
    try {
      const shippingMethods = await ShippingMethods.getShippingMethods();

      res.json({
        status: 'success',
        message: 'Shipping Methods Loaded',
        data: shippingMethods
      });
    } catch (error) {
      next(error);
    }
  } 
}

module.exports = shippingMethodsController;