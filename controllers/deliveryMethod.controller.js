const deliveryMethodModel = require('../models/deliveryMethod.model');

const deliveryMethodsController = {
  getDeliveryMethods: async (req, res, next) => {
    try {
      const deliveryMethods = await deliveryMethodModel.getDeliveryMethods();

      res.json({
        status: 'success',
        message: 'Delivery Methods Loaded',
        data: deliveryMethods
      });
    } catch (error) {
      next(error);
    }
  } 
}

module.exports = deliveryMethodsController;