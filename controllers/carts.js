const pool = require('../models/database');
const cartModel = require('../models/carts');
const orderModel = require('../models/orders');

const cartController = {
  // Get authenticated user cart
  getCart: async (req, res, next) => {
    try {
      const userId = req.user.id;

      const cart = await cartModel.getCartByUserId(userId);
      const items = await cartModel.getCartItems(cart.id);

      return res.json({
        success: true,
        message: 'Cart retrieved',
        data: { cart: { ...cart, items } }
      });
    } catch (error) {
      next(error);
    }
  },

  // Get a cart by its ID (cartId)
  getCartById: async (req, res, next) => {
    try {
      const cartId = parseInt(req.params.cartId);
      const cart = await cartModel.getCartById(cartId);
      const items = await cartModel.getCartItems(cartId);

      return res.json({
        success: true,
        message: 'Cart retrieved',
        data: { cart: { ...cart, items } }
      });
    } catch (err) {
      next(err);
    }
  },

  // Create new cart
  createCart: async (req, res, next) => {
    try {
      const { userId } = req.body;
      const newCart = await cartModel.createCart(parseInt(userId));

      res.status(201).json({
        success: true,
        message: 'Cart created successfully.',
        data: { cart: newCart }
      });
    } catch (error) {
      next(error);
    }
  },

  // Add a new product to the specified cart, by providing productId and quantity
  addItem: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const item = req.body;

      const cart = await cartModel.getCartByUserId(userId);
      const insertedItem = await cartModel.addItem(cart.id, item);

      return res.status(201).json({
        success: true,
        message: 'Item inserted.',
        data: { item: insertedItem }
      });
    } catch (err) {
      next(err);
    }
  },

  // Update the quantity of a specific product in the cart
  updateItemQuantity: async (req, res, next) => {
    try {
      const { cartId, productId } = req.params;
      const quantity = parseInt(req.body.quantity);

      const updatedItem = await cartModel.updateItemQuantity(parseInt(cartId), parseInt(productId), quantity);

      res.json({
        success: true,
        message: 'Item Quantity Updated.',
        data: { item: updatedItem }
      });
    } catch (err) {
      next(err);
    }
  },

  // Remove a specific product from the cart
  deleteItem: async (req, res, next) => {
    try {
      const cartId = parseInt(req.params.cartId);
      const productId = parseInt(req.params.productId);

      await cartModel.deleteItemFromCart(cartId, productId);

      res.status(204).send();

    } catch (err) {
      next(err);
    }
  },

  // Delete a cart
  deleteCart: async (req, res, next) => {
    try {
      const cartId = parseInt(req.params.cartId);

      await cartModel.deleteCart(cartId);

      res.status(204).send();

    } catch (err) {
      next(err);
    }
  },

  // Checkout
  checkout: async (req, res, next) => {
    const client = await pool.connect(); // Start a new database transaction
    try {
      const cartId = parseInt(req.params.cartId);
      const userId = req.user.id;

      await client.query('BEGIN');

      await orderModel.createOrder(userId, cartId, client);
      await cartModel.clearCartByUserId(userId, client); // Clear the cart within the transaction

      await client.query('COMMIT');

      res.status(201).json({
        success: true,
        message: 'Order created.'
      });
    } catch (err) {
      await client.query('ROLLBACK');
      next(err);
    } finally {
      client.release();
    }
  },
  
  // Clear cart
  clearCart: async (req, res, next) => {
    try {
      const cartId = req.params.cartId;

      await cartModel.clearCartByUserId(cartId);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
};

module.exports = cartController;