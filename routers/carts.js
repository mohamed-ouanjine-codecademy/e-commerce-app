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

// create cart by ID
router.get('/:cartId', async (req, res, next) => {
  try {
    const cartId = req.params.cartId;

    const cart = await db.carts.getCartById(cartId);

    res.json(cart);

  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Create a new cart with the user's ID
    const newCart = await db.carts.createCart(userId);

    res.status(201).json(newCart);
  } catch (error) {
    next(error);
  }
});

router.post('/:cartId', async (req, res, next) => {
  try {
    const cartId = parseInt(req.params.cartId); // cartId: 1
    const items = req.body; // [{productId: 1, quantity: 3}, {productId: 32, quantity: 1}]

    const cart = await db.carts.updateCartById(cartId, items); // { cartId: 1, items: [{productId: 1, quantity: 3}, {productId: 32, quantity: 1}] }

    res.json(cart);

  } catch (err) {
    next(err);
  }
});

// update quantity of a product within a cart
router.post('/:cartId/items/:productId', async (req, res, next) => {
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

// delete a cart
router.delete('/:cartId', async (req, res, next) => {
  try {
    const cartId = parseInt(req.params.cartId);

    const deletedCart = await db.carts.deleteCart(cartId);

    res.json(deletedCart);

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

    res.json(order);

  } catch (err) {
    next(err);
  }
});


module.exports = router;