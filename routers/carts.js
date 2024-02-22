const router = require('express').Router();

const db = require('../controllers');

// get authenticated user cart
router.get('/cart', async (req, res, next) => {
  try {
    if (req.isAuthenticated()) {
      userId = req.user.id;
      include = req.query.include;

      const cart  = await db.carts.getCartByUserId(userId, include);

      return res.json({  status: 'success', data: { ...cart } })
    }
    res.status(401).json({
      status: 'error',
      message: 'Unauthorized, Please Sign In to access your cart'
    });
  } catch (error) {
    next(error);
  }
});
// get a cart by its ID (cartId).
router.get('/:cartId', async (req, res, next) => {
  try {
    const { cartId } = req.params;
    const { include } = req.query;

    const cart = await db.carts.getCartById(cartId, include);

    res.json(cart);

  } catch (err) {
    next(err);
  }
});

// get a cart by its user ID.
router.get('/users/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { include } = req.query;

    const cart = await db.carts.getCartByUserId(userId, include);

    res.json(cart);

  } catch (err) {
    next(err);
  }
});

// Create new cart
router.post('/', async (req, res, next) => {
  try {
    // const userId = req.user.id;
    const { userId, items } = req.body;

    // Create a new cart with the user's ID
    const newCart = await db.carts.createCart(parseInt(userId), items);

    res.status(201).json(newCart);
  } catch (error) {
    next(error);
  }
});

// Add a new product to the specified cart, by providing productId and quantity.
router.post('/items', async (req, res, next) => {
  try {
    if (req.isAuthenticated()) {
      // const cartId = parseInt(req.params.cartId);
      const userId = req.user.id;
      const item = req.body;
      const include = req.query.include;

      const updatedCart = await db.carts.addItemToCart(userId, item, include);

      return res.status(201).json(updatedCart);
    }
    res.status(401).json({
      status: 'error',
      message: 'Unauthorized'
    });
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

    res.json({
      status: 'success',
      message: 'Item Quantity Updated.',
      data: cartsProduct
    });
    
  } catch (err) {
    next(err);
  }
});

// Remove a specific product from the cart.
router.delete('/:cartId/items/:productId', async (req, res, next) => {
  try {
    const cartId = parseInt(req.params.cartId);
    const productId = parseInt(req.params.productId);

    const result = await db.carts.deleteItemFromCart(cartId, productId);

    res.json(result);

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