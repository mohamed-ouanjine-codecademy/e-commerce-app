const pool = require('./database.js');
const help = require('./utils.js');
const products = require('./products.js');

const cartModel = {
  // Create new cart
  createCart: async function (userId, client) {
    try {
      if (!client) client = await pool.connect();

      if (typeof userId !== 'number') {
        throw new help.MyError('Invalid input data, user id MUST be a number.', 400);
      }

      // Create new cart
      const results = await client.query(
        `
        INSERT INTO carts (user_id) VALUES
          ($1)
        RETURNING *;
        `,
        [userId]
      );
      const newCart = results.rows[0];

      // Convert created_at from object to string
      newCart.created_at = `${newCart.created_at}`;

      return help.convertKeysFromSnakeCaseToCamelCase(newCart);

    } catch (error) {
      throw error;
    }
  },

  // Get a cart by its ID
  getCartById: async function (cartId) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const results = await client.query(`
        SELECT id, created_at
        FROM carts
        WHERE id = $1`,
        [cartId]
      );
      // Check if the cart exists
      if (results.rows.length === 0) throw new help.NotFound('cart');

      await client.query('COMMIT');

      const cart = results.rows[0];
      // Convert created_at from object to string
      cart.created_at = `${cart.created_at}`;

      return help.convertKeysFromSnakeCaseToCamelCase(cart);

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;

    } finally {
      client.release();
    }
  },

  // Get a cart by user ID
  getCartByUserId: async function (userId) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const results = await client.query(`
        SELECT id, created_at
        FROM carts
        WHERE user_id = $1`,
        [userId]
      );

      if (results.rows.length === 0) {
        throw new help.NotFound('cart');
      }

      await client.query('COMMIT');

      const cart = results.rows[0];
      cart.created_at = `${cart.created_at}`;

      return help.convertKeysFromSnakeCaseToCamelCase(cart);
    } catch (error) {
      throw error;
    }
  },

  // Get cart items
  getCartItems: async function (cartId) {
    try {
      if (typeof cartId !== 'number') {
        throw new help.MyError('Invalid input data, cart id MUST be a number');
      }

      const results = await pool.query(`
        SELECT
          product_id,
          quantity
        FROM carts_products
        WHERE cart_id = $1;`,
        [cartId]
      );
      const items = help.convertKeysFromSnakeCaseToCamelCase(results.rows);

      const cartItems = await Promise.all(
        items.map(async ({ productId, quantity }) => {
          const { id: productIdFromProduct, ...product } = await products.getProductById(productId);
          return {
            id: productId,
            quantity,
            ...product,
          };
        })
      );

      return cartItems;
    } catch (error) {
      throw error;
    }
  },

  // Add item to cart
  addItem: async function (cartId, item) {
    try {
      if (typeof cartId !== 'number' || typeof item !== 'object') {
        throw new help.MyError('Invalid input data.', 400);
      }

      const results = await pool.query(
        `
        INSERT INTO carts_products (cart_id, product_id, quantity)
        VALUES ($1, $2, $3)
        RETURNING *;
        `,
        [cartId, item.id, item.quantity]
      );
      const insertedItem = help.convertKeysFromSnakeCaseToCamelCase(results.rows[0]);

      return insertedItem;
    } catch (error) {
      throw error;
    }
  },

  // Delete item from cart
  deleteItemFromCart: async function (cartId, productId) {
    try {
      if ((typeof cartId !== 'number') || (typeof productId !== 'number')) {
        throw new Error('Invalid input data; cartId and productId MUST be a number.');
      }

      const results = await pool.query(`
        DELETE FROM carts_products
        WHERE cart_id = $1
          AND product_id = $2;`,
        [cartId, productId]
      );
      // Check cart existence
      if (results.rowCount === 0) throw new help.NotFound('cart or item');

    } catch (error) {
      throw error;
    }
  },

  // Update item quantity in cart
  updateItemQuantity: async function (cartId, productId, quantity) {
    try {
      if (
        (typeof cartId != 'number') ||
        (typeof productId != 'number') ||
        (typeof quantity != 'number')
      ) {
        throw new help.MyError('Invalid input data', 400);
      }

      const results = await pool.query(`
        UPDATE carts_products
        SET quantity = $1
        WHERE cart_id = $2
          AND product_id = $3
        RETURNING *`,
        [quantity, cartId, productId]
      );
      // Check if there is a cart
      if (results.rowCount === 0) throw new help.NotFound('cart');

      return help.convertKeysFromSnakeCaseToCamelCase(results.rows[0]);
    } catch (error) {
      throw error;
    }
  },

  // Delete cart
  deleteCart: async function (cartId) {
    const client = await pool.connect();
    try {
      if (typeof cartId != 'number') {
        throw new Error('Invalid input data');
      }

      await client.query('BEGIN');

      // Remove any row related to the cart in carts_products table
      const results1 = await this.helpers.clearCartContent(cartId, client);

      const results2 = await client.query(`
        DELETE FROM carts
        WHERE id = $1;`,
        [cartId]
      );
      await client.query('COMMIT');

      if (results2.rowCount === 0) throw new help.NotFound('cart');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  // Clear cart
  clearCartByUserId: async function (userId, client) {
    if (!client) client = pool;
    try {
      if (typeof userId !== 'number') {
        throw new Error('Invalid input data; userId MUST be a number.');
      }

      // Check if the cart exists
      const cart = await this.getCartByUserId(userId);

      await this.helpers.clearCartContent(cart.id, client);

    } catch (error) {
      throw error;
    }
  },
  // Clear cart
  clearCartById: async function (cartId, client) {
    if (!client) client = pool;
    try {
      if (typeof userId !== 'number') {
        throw new Error('Invalid input data; userId MUST be a number.');
      }

      // Check if the cart exists
      await this.getCartById(cartId);

      await this.helpers.clearCartContent(cartId, client);

    } catch (error) {
      throw error;
    }
  },

  // Helper functions
  helpers: {
    clearCartContent: async function (cartId, client) {
      try {
        return await client.query(`
          DELETE FROM carts_products
          WHERE cart_id = $1
          RETURNING product_id, quantity;`,
          [cartId]
        );

      } catch (error) {
        throw error;
      }
    }
  }
};

module.exports = cartModel;