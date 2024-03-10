const router = require("express").Router();

const {
  getDeliveryMethods
} = require('../controllers/deliveryMethods');

// Get all shipping methods.
router.get('/', getDeliveryMethods);

module.exports = router;