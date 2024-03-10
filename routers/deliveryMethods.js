const router = require("express").Router();

const {
  getDeliveryMethods
} = require('../controllers/deliveryMethods');

// Get all delivery methods.
router.get('/', getDeliveryMethods);

module.exports = router;