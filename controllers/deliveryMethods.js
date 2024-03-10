const DeliveryMethods = require('../models/deliveryMethods');

const deliveryMethodsController = {
  getDeliveryMethods: async (req, res, next) => {
    try {
      const deliveryMethods = await DeliveryMethods.getDeliveryMethods();

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