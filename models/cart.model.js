const pool = require('./database.js');
const help = require('./utils.js');

const cartModel = {
  // Create new cart
  createCart: async function (userId) {
    try {
      const results = await pool.query(
        `INSERT INTO carts (user_id) VALUES ($1) RETURNING id, created_at;`,
        [userId]
      );

      results.rows[0].created_at = `${results.rows[0].created_at}`;
      const newCart = help.convertKeysFromSnakeCaseToCamelCase(results.rows[0]);

      return {
        ...newCart,
        total: 0
      };
    } catch (error) {
      throw new Error('Failed to create cart');
    }
  },

  // Get a cart by its ID
  getCartById: async function (cartId) {
    try {
      const results = await pool.query(
        `SELECT id, created_at FROM carts WHERE id = $1`,
        [cartId]
      );

      if (results.rows.length === 0) {
        throw new help.NotFound('cart');
      }

      const cart = results.rows[0];
      cart.created_at = `${cart.created_at}`;

      return help.convertKeysFromSnakeCaseToCamelCase();
    } catch (error) {
      throw new Error('Failed to get cart by ID');
    }
  },

  // Get a cart by user ID
  getCartByUserId: async function(userId) {
    try {
      const results = await pool.query(
        `SELECT id, created_at FROM carts WHERE user_id = $1`,
        [userId]
      );

      if (results.rows.length === 0) {
        throw new help.NotFound('cart');
      }

      const cart = results.rows[0];
      cart.created_at = `${cart.created_at}`;
      const items = await this.getCartItems(cart.id);
      const total = items.reduce((accumulator, item) => accumulator + parseFloat(item.subtotal), 0);

      return help.convertKeysFromSnakeCaseToCamelCase({
        ...cart,
        items,
        total: total.toFixed(2),
      });
    } catch (error) {
      if (error.status === 404) throw error
      else throw new Error('Failed to get cart by user ID');
    }
  },

  // Get cart items
  getCartItems: async function (cartId) {
    try {
      const results = await pool.query(`
        SELECT
          cp.product_id AS id,
          cp.quantity,
          p.name,
          p.price,
          p.image_url,
          (cp.quantity * p.price) AS subtotal
        FROM carts_products cp
        JOIN products p ON cp.product_id = p.id
        WHERE cp.cart_id = $1;`,
        [cartId]
      );

      const items = help.convertKeysFromSnakeCaseToCamelCase(results.rows);
      return items;
    } catch (error) {
      throw new Error('Failed to get cart items');
    }
  },

  // Add item to cart
  addItem: async function (cartId, item) {
    try {
      const results = await pool.query(
        `INSERT INTO carts_products (cart_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *;`,
        [cartId, item.id, item.quantity]
      );

      const insertedItem = help.convertKeysFromSnakeCaseToCamelCase(results.rows[0]);
      return insertedItem;
    } catch (error) {
      throw new Error('Failed to add item to cart');
    }
  },

  // Delete item from cart
  deleteItemFromCart: async function (cartId, productId) {
    try {
      const results = await pool.query(
        `DELETE FROM carts_products WHERE cart_id = $1 AND product_id = $2`,
        [cartId, productId]
      );
      // Check cart existence
      if (results.rowCount === 0) {
        throw new help.NotFound('cart or item');
      }
    } catch (error) {
      throw new Error('Failed to delete item from cart');
    }
  },

  // Update item quantity in cart
  updateItemQuantity: async function (cartId, productId, quantity) {
    try {
      const results = await pool.query(
        `UPDATE carts_products SET quantity = $1 WHERE cart_id = $2 AND product_id = $3 RETURNING *`,
        [quantity, cartId, productId]
      );

      if (results.rowCount === 0) {
        throw new help.NotFound('cart');
      }

      const updatedItem = help.convertKeysFromSnakeCaseToCamelCase(results.rows[0]);
      return updatedItem;
    } catch (error) {
      throw new Error('Failed to update item quantity');
    }
  },

  // Delete cart
  deleteCart: async function (cartId, client) {
    if (!client) client = pool;
    try {
      const results = await pool.query(`DELETE FROM carts_products WHERE cart_id = $1`, [cartId]);

      if (results.rowCount === 0) {
        throw new help.NotFound('cart');
      }
    } catch (error) {
      throw new Error('Failed to clear cart');
    }
  },

  // Clear cart
  clearCartContent: async function (cartId, client) {
    if (!client) client = pool;
    try {
      const results = await client.query(`DELETE FROM carts_products WHERE cart_id = $1`, [cartId]);

      if (results.rowCount === 0) {
        throw new help.NotFound('cart');
      }
    } catch (error) {
      throw new Error('Failed to clear cart');
    }
  },

  checkUserCartRel: async function(userId, cartId) {
    try {
      const cart = await this.getCartByUserId(userId);

      return cart.id === cartId;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to check user cart relationship');
    }
  }

};

module.exports = cartModel;