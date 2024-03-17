const router = require('express').Router();
const help = require('./utils');
const {
  createCart,
  getCart,
  getCartById,
  addItem,
  updateItemQuantity,
  deleteItem,
  deleteCart,
  checkout,
  clearCart
} = require('../controllers/carts');

// Get authenticated user cart
router.get('/cart', help.checkAuthentication, getCart);
// Get a cart by its ID (cartId)
router.get('/:cartId', getCartById);
// Create new cart
router.post('/', createCart);
// Add a new product to the specified cart, by providing productId and quantity
router.post('/items', help.checkAuthentication, addItem);
// Update the quantity of a specific product in the cart
router.put('/:cartId/items/:productId', updateItemQuantity);
// Remove a specific product from the cart
router.delete('/:cartId/items/:productId', deleteItem);
// Clear cart
router.delete('/:cartId/clear', clearCart);
// Delete a cart
router.delete('/:cartId', deleteCart);
// Checkout
router.post('/:cartId/checkout', checkout);

module.exports = router;
