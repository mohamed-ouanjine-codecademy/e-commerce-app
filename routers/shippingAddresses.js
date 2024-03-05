const router = require('express').Router();
const { isAuthenticated } = require('../helperFunctions').middlewares;
const {
  createShippingAddress,
  getShippingAddressesByUserId,
  editShippingAddressByUserId,
  deleteShippingAddressByUserId
} = require('../controllers/shippingAddresses');

router.use(isAuthenticated);

// Create new shipping address
router.post('/', createShippingAddress);

// Get all shipping address related to a user
router.get('/', getShippingAddressesByUserId);

// Edit shipping address by user's id
router.patch('/:shippingAddressId', editShippingAddressByUserId);

// Delete shipping address by id and user's id
router.delete('/:shippingAddressId', deleteShippingAddressByUserId);

module.exports = router;