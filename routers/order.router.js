const router = require('express').Router();

const orderModel = require('../models/order.model.js');
const help = require('../utils/index.js');


router.use(help.middlewares.isAuthenticated);

// get all orderModel
router.get('/', async (req, res, next) => {
  try {
    const userId = req.user.id;

    const results = await orderModel.getOrdersByUserId(userId);

    res.json(results);
    
  } catch (err) {
    next(err);
  }
});

// get an ordre by its ID
router.get('/:orderId', async (req, res, next) => {
  try {
    const userId = req.user.id;
    const orderId = parseInt(req.params.orderId);

    const order = await orderModel.getOrderByIdAndUserId(userId, orderId);

    res.json(order);

  } catch (err) {
    next(err);
  }
});

// Update order's status (e.g. placed, processing, shipped...)
router.put('/:orderId/status', async (req, res, next) => {
  try {
    const userId = req.user.id;
    const orderId = parseInt(req.params.orderId);
    const status = req.body.status;

    const UpdatedOrder = await orderModel.updateStatus(userId, orderId, status);

    res.json(UpdatedOrder);

  } catch (err) {
    next(err);
  }
});

// Add an item to the order
router.post('/:orderId/items', async (req, res, next) => {
  try {
    const userId = req.user.id;
    const orderId = parseInt(req.params.orderId);
    const itemInfo = req.body;

    const updatedOrder = await orderModel.addItemToOrder(userId, orderId, itemInfo);

    res.status(201).json(updatedOrder);

  } catch (err) {
    next(err);
  }
});

// Update the quantity of a specific product in an order
router.put('/:orderId/items/:productId', async (req, res, next) => {
  try {
    const userId = req.user.id;
    const orderId = parseInt(req.params.orderId);
    const productId = parseInt(req.params.productId);
    const quantity = req.body.quantity;

    const updatedOrder = await orderModel.updateOrderProductQuantity(userId, orderId, productId, quantity);

    res.json(updatedOrder);

  } catch (err) {
    next(err);
  }
})

// Romove an item from an order
router.delete('/:orderId/items/:productId', async (req, res, next) => {
  try {
    const userId = req.user.id;
    const orderId = parseInt(req.params.orderId);
    const productId = parseInt(req.params.productId);

    await orderModel.removeItemFromOrderd(userId, orderId, productId);

    res.status(204).send();

  } catch (err) {
    next(err);
  }
});

// delete an order by its ID
router.delete('/:orderId', async (req, res, next) => {
  try {
    const userId = req.user.id;
    const orderId = parseInt(req.params.orderId);

    await orderModel.deleteOrderByIdAndUserId(userId, orderId);

    res.status(204).send();

  } catch (err) {
    next(err);
  }
})

module.exports = router;
