const router = require("express").Router();

const {
  getShippingMethods
} = require('../controllers/shippingMethods');

// Get all shipping methods.
router.get('/', getShippingMethods);

module.exports = router;