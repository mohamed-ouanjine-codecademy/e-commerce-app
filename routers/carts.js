const router = require('express').Router();

const db = require('../db/index.js');

// Middlewares
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

router.use(isAuthenticated);

// get a cart by its ID (cartId).
router.get('/:cartId', async (req, res, next) => {
  try {
    const cartId = req.params.cartId;

    const cart = await db.carts.getCartById(cartId);

    res.json(cart);

  } catch (err) {
    next(err);
  }
});

// Create new cart
router.post('/', async (req, res, next) => {
  try {
    const userId = req.user.id;
    const items = req.body.items;

    // Create a new cart with the user's ID
    const newCart = await db.carts.createCart(userId, items);

    res.status(201).json(newCart);
  } catch (error) {
    next(error);
  }
});

// Add a new product to the specified cart, by providing productId and quantity.
router.post('/:cartId/items', async (req, res, next) => {
  try {
    const cartId = parseInt(req.params.cartId);
    const item = req.body;

    const updatedCart = await db.carts.addItemToCart(cartId, item);

    res.status(201).json(updatedCart);

  } catch (err) {
    next(err);
  }
});

// Update the quantity of a specific product in the cart.
router.put('/:cartId/items/:productId', async (req, res, next) => {
  try {
    const cartId = parseInt(req.params.cartId);
    const productId = parseInt(req.params.productId);
    const quantity = parseInt(req.body.quantity);

    const cartsProduct = await db.carts.updateCartProductQuantity(cartId, productId, quantity);

    res.json(cartsProduct);

  } catch (err) {
    next(err);
  }
});

// Remove a specific product from the cart.
router.delete('/:cartId/items/:productId', async (req, res, next) => {
  try {
    const cartId = parseInt(req.params.cartId);
    const productId = parseInt(req.params.productId);

    await db.carts.deleteItemFromCart(cartId, productId);

    res.status(204).send();

  } catch (err) {
    next(err);
  }
});

// Remove all products from the cart.
router.delete('/:cartId/items', async (req, res, next) => {
  try {
    const cartId = parseInt(req.params.cartId);
    
    await db.carts.clearCart(cartId);

    res.status(204).send();

  } catch (err) {
    next(err);
  }
});

// delete a cart
router.delete('/:cartId', async (req, res, next) => {
  try {
    const cartId = parseInt(req.params.cartId);

    await db.carts.deleteCart(cartId);

    res.status(204).send();

  } catch (err) {
    next(err);
  }
})

// checkout
router.post('/:cartId/checkout', async (req, res, next) => {
  try {
    const cartId = parseInt(req.params.cartId);
    const userId = req.user.id;

    const order = await db.carts.createOrder(cartId, userId);

    res.status(201).json(order);

  } catch (err) {
    next(err);
  }
});


module.exports = router;