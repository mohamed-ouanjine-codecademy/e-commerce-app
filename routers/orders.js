const router = require('express').Router();

const db = require('../db/index.js');
const help = require('../helperFunctions.js');


router.use(help.middlewares.isAuthenticated);

// get all orders
router.get('/', async (req, res, next) => {
  try {
    const userId = req.user.id;

    const orders = await db.orders.getOrdersByUserId(userId);

    res.json(orders);
    
  } catch (err) {
    next(err);
  }
});

// get an ordre by its ID
router.get('/:orderId', async (req, res, next) => {
  try {
    const userId = req.user.id;
    const orderId = parseInt(req.params.orderId);

    const order = await db.orders.getOrderByIdAndUserId(null, userId, orderId);

    res.json(order);

  } catch (err) {
    next(err);
  }
});

// delete an order by its ID
router.delete('/:orderId', async (req, res, next) => {
  try {
    const userId = req.user.id;
    const orderId = parseInt(req.params.orderId);

    const deletedOrder = await db.orders.deleteOrderByIdAndUserId(userId, orderId);

    res.json(deletedOrder);
  } catch (err) {
    next(err);
  }
})

module.exports = router;
