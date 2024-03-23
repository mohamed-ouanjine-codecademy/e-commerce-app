const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const passport = require('passport');

// Middleware to authenticate user
router.use(passport.authenticate('jwt', { session: false }));
// check the if the user own the cart
router.param('cartId', cartController.checkUserCartRel);

// Get authenticated user's cart
router.get('/', cartController.getCart);

// Create a new cart
router.post('/', cartController.createCart);

// Add a new product to the cart
router.post('/:cartId/items', cartController.addItem);

// Update the quantity of a specific product in the cart
router.put('/:cartId/items/:productId', cartController.updateItemQuantity);

// Remove a specific product from the cart
router.delete('/:cartId/items/:productId', cartController.removeItem);

// Clear all items from the cart
router.delete('/:cartId/items', cartController.clearCart);

// Delete a specific cart
router.delete('/:cartId', cartController.deleteCart);

// Checkout from the cart
router.post('/:cartId/checkout', cartController.checkout);

module.exports = router;
