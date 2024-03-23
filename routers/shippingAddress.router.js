const router = require('express').Router();
const SAController = require('../controllers/shippingAddress.controller');
const passport = require('passport');

router.use(passport.authenticate('jwt', { session: false }));

// Create new shipping address
router.post('/', SAController.createShippingAddress);

// Get all shipping address related to a user
router.get('/', SAController.getShippingAddressesByUserId);

// Edit shipping address by user's id
router.patch('/:shippingAddressId', SAController.editShippingAddressByUserId);

// Delete shipping address by id and user's id
router.delete('/:shippingAddressId', SAController.deleteShippingAddressByUserId);

module.exports = router;