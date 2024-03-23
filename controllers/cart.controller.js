const pool = require('../models/database');
const cartModel = require('../models/cart.model');
const orderModel = require('../models/order.model');
const help = require('../models/utils');

const cartController = {
  // Get authenticated user's cart
  getCart: async (req, res, next) => {
    try {
      const userId = req.user.id;

      const cart = await cartModel.getCartByUserId(userId);

      res.json({
        success: true,
        message: 'Cart retrieved',
        data: cart
      });
    } catch (error) {
      next(error);
    }
  },

  // Create a new cart
  createCart: async (req, res, next) => {
    try {
      const userId = req.user.id;
      // Check if cart already exists for the user
      try {
        const cart = await cartModel.getCartByUserId(userId);
        if (cart) {
          throw new help.MyError('User already has a cart.', 400);
        }
      } catch (error) {
        if (error.status !== 404) throw error;
      }
      const newCart = await cartModel.createCart(userId);

      res.status(201).json({
        success: true,
        message: 'Cart created successfully.',
        data: newCart
      });
    } catch (error) {
      next(error);
    }
  },

  // Add a new product to the specified cart, by providing productId and quantity
  addItem: async (req, res, next) => {
    try {
      const cartId = parseInt(req.params.cartId);
      const item = req.body;

      // Get existing items in the cart
      const cartItems = await cartModel.getCartItems(cartId);
      // Check if the item already exists in the cart
      const isItemExist = cartItems.some(element => element.id === item.id);
      if (isItemExist) {
        throw new help.MyError('Item already exists.', 400);
      }
      const insertedItem = await cartModel.addItem(cartId, item);

      res.status(201).json({
        success: true,
        message: 'Item added successfully.',
        data: insertedItem
      });
    } catch (error) {
      next(error);
    }
  },

  // Update the quantity of a specific product in the cart
  updateItemQuantity: async (req, res, next) => {
    try {
      const { cartId, productId } = req.params;
      const { quantity } = req.body;

      const updatedItem = await cartModel.updateItemQuantity(parseInt(cartId), parseInt(productId), parseInt(quantity));

      res.json({
        success: true,
        message: 'Item quantity updated successfully.',
        data: updatedItem
      });
    } catch (error) {
      next(error);
    }
  },

  // Remove a specific product from the cart
  removeItem: async (req, res, next) => {
    try {
      const { cartId, productId } = req.params;

      await cartModel.deleteItemFromCart(parseInt(cartId), parseInt(productId));

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },

  // Clear all items from the cart
  clearCart: async (req, res, next) => {
    try {
      const { cartId } = req.params;

      await cartModel.clearCartContent(parseInt(cartId));

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },

  // Delete a specific cart
  deleteCart: async (req, res, next) => {
    const client = await pool.connect();
    try {
      const { cartId } = req.params;
      await client.query('BEGIN');
      // Clear cart
      await cartModel.clearCartContent(parseInt(cartId), client)
      // Delete cart
      await cartModel.deleteCart(parseInt(parseInt(cartId), client));
      await client.query('COMMIT');

      res.status(204).send();
    } catch (error) {
      await client.query('ROLLBACK');
      next(error);
    } finally {
      client.release();
    }
  },

  // Checkout from the cart
  checkout: async (req, res, next) => {
    const client = await pool.connect(); // Start a new database transaction
    try {
      const { cartId } = req.params;
      const userId = req.user.id;

      await client.query('BEGIN');

      // Create order
      await orderModel.createOrder(userId, parseInt(cartId), client);

      // Clear the cart
      await cartModel.clearCartById(cartId, client);

      await client.query('COMMIT');

      res.status(201).json({
        success: true,
        message: 'Order created successfully.'
      });
    } catch (error) {
      await client.query('ROLLBACK');
      next(error);
    } finally {
      client.release();
    }
  },

  checkUserCartRel: async (req, res, next) => {
    try {
      const userId = parseInt(req.user.id);
      const cartId = parseInt(req.params.cartId);

      isOwner = await cartModel.checkUserCartRel(userId, cartId);
      if (!isOwner) throw new Error('User is not the cart owner');
      next();
    } catch (error) {
      next(error);
    }
  }
};

module.exports = cartController;