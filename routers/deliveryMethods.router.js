const router = require("express").Router();

const deliveryMethodController = require('../controllers/deliveryMethod.controller');

// Get all delivery methods.
router.get('/', deliveryMethodController.getDeliveryMethods);

module.exports = router;