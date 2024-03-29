const pool = require('./database.js');
const help = require('./helperFunctions.js');
const products = require('./products.js');

const carts = {
  createCart: async function (client, userId, items) {
    const shouldRelease = client ? false : true;
    try {
      if (shouldRelease) {
        client = await pool.connect();
      }

      if (typeof userId !== 'number') {
        throw new Error('Invalid input data; userid MUST be a number.');
      }

      shouldRelease && await client.query('BEGIN');

      // Create new cart
      const results = await client.query(`
        INSERT INTO carts (user_id) VALUES
          ($1)
        RETURNING *;`,
        [userId]
      );
      const newCart = results.rows[0];
      // Convert creted_at from object to string
      newCart.created_at = `${newCart.created_at}`;

      // Create new cart items
      if (items) {
        await client.query(`
          INSERT INTO carts_products VALUES
            ($1, $2, $3);`,
          [newCart.id, items[0].productId, items[0].quantity]
        );
        newCart.items = [items[0]];
      }

      shouldRelease && await client.query('COMMIT');

      return help.transformKeys(newCart);

    } catch (err) {
      shouldRelease && await client.query('ROLLBACK');
      throw err;

    } finally {
      shouldRelease && client.release()
    }
  },

  getCartById: async function (cartId, include) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const results = await client.query(`
        SELECT *
        FROM carts
        WHERE id = $1`,
        [cartId]
      );

      // check if the cart exist
      const cart = await help.checkExistence(results, 'Cart');

      // get all row (product_id, quantity) related to the cart in carts_products table
      const cartItems = await this.helpers.getItemsBycartId(client, cartId, include);

      await client.query('COMMIT');

      // Convert creted_at from object to string
      cart.created_at = `${cart.created_at}`;

      return help.transformKeys({ ...cart, items: cartItems });

    } catch (err) {
      await client.query('ROLLBACK');
      throw err;

    } finally {
      client.release();
    }
  },

  getCartByUserId: async function (userId, include) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const results = await client.query(`
        SELECT *
        FROM carts
        WHERE user_id = $1`,
        [userId]
      );

      // check if the cart exist
      const cart = help.checkExistence(results, 'Cart');
      // get all row (product_id, quantity) related to the cart in carts_products table
      let cartItems;
      if (include) {
        const cartId = cart.id;
        cartItems = await this.helpers.getItemsBycartId(client, cartId, include);
      }

      await client.query('COMMIT');

      // Convert creted_at from object to string
      cart.created_at = `${cart.created_at}`;

      return help.transformKeys({ ...cart, items: cartItems });

    } catch (err) {
      throw err;
    }
  },

  addItemToCart: async function (userId, item, include) {
    const client = await pool.connect();
    try {
      if ((typeof userId != 'number') || (typeof item != 'object')) {
        throw new Error('Invalid input data; cartId must be a number and items must be an array');
      }

      // check if the cart exist
      const cart = await this.getCartByUserId(userId, false);
      const cartId = cart.id;

      await client.query('BEGIN');

      await client.query(`
        INSERT INTO carts_products VALUES
          ($1, $2, $3);`,
        [cartId, item.productId, item.quantity]
      );
      // get all row (product_id, quantity) related to the cart in carts_products table
      const items = await this.helpers.getItemsBycartId(client, cartId, include);

      await client.query('COMMIT');


      return help.transformKeys({ id: cartId, items });

    } catch (err) {
      await client.query('ROLLBACK');
      throw err;

    } finally {
      client.release();
    }
  },

  deleteItemFromCart: async function (cartId, productId) {
    try {
      if ((typeof cartId !== 'number') || (typeof productId !== 'number')) {
        throw new Error('Invalid input data; cartId and productId MUST be a number.');
      }

      // check if the cart exist
      await this.getCartById(cartId);

      const results = await pool.query(`
        DELETE FROM carts_products
        WHERE cart_id = $1
          AND product_id = $2;`,
        [cartId, productId]
      );

      return {
        data: {
          product: {
            id: productId
          },
          cart: {
            id: cartId
          }
        },
        message: 'product deleted successfully'
      }

    } catch (err) {
      throw err;
    }
  },

  updateCartProductQuantity: async function (cartId, productId, quantity) {
    try {
      if (
        (typeof cartId != 'number') ||
        (typeof productId != 'number') ||
        (typeof quantity != 'number')
      ) {
        throw new Error('Invalid input data');
      }

      // check if the cart exist
      await this.getCartById(cartId);

      const results = await pool.query(`
        UPDATE carts_products
        SET quantity = $1
        WHERE cart_id = $2
          AND product_id = $3
        RETURNING *`,
        [quantity, cartId, productId]
      );

      const updatedProduct = help.transformKeys(results.rows[0]);
      return updatedProduct;

    } catch (err) {
      throw err;
    }
  },

  deleteCart: async function (cartId) {
    const client = await pool.connect();
    try {
      if (typeof cartId != 'number') {
        throw new Error('Invalid input data');
      }

      // check if the cart exist
      await this.getCartById(cartId);

      await client.query('BEGIN');

      // remove any row related to the cart in carts_products table
      const results = await this.helpers.clearCartContent(client, cartId);

      await client.query(`
        DELETE FROM carts
        WHERE id = $1;`,
        [cartId]
      );


      const items = results.rows;

      await client.query('COMMIT');

      const deletedCart = {
        cartId,
        items
      };

      return help.transformKeys(deletedCart);

    } catch (err) {
      await client.query('ROLLBACK');
      throw err;

    } finally {
      client.release();
    }
  },

  createOrder: async function (cartId, userId) {
    const client = await pool.connect();
    try {
      // check if the cart exist
      await this.getCartById(cartId);

      await client.query('BEGIN');

      // create new order
      const results = await client.query(`
        INSERT INTO orders (user_id) VALUES
          ($1)
        RETURNING id;`,
        [userId]
      );

      const orderId = results.rows[0].id;

      // related order with products based on the cartId
      const results2 = await client.query(`
        INSERT INTO orders_products
        SELECT
        	orders.id AS id,
          carts_products.product_id as product_id,
          carts_products.quantity as quantity
        FROM orders
        INNER JOIN carts
        	ON orders.user_id = carts.user_id
        INNER JOIN carts_products
        	ON carts.id = carts_products.cart_id
        WHERE orders.id = $1
        RETURNING product_id, quantity;`,
        [orderId]
      );

      const items = results2.rows;

      // remove any row related to the cart in carts_products table
      await this.helpers.clearCartContent(client, cartId);

      await client.query('COMMIT');

      return help.transformKeys({
        orderId,
        items
      });

    } catch (err) {
      await client.query('ROLLBACK');
      throw err;

    } finally {
      client.release();
    }
  },

  clearCart: async function (cartId) {
    const client = await pool.connect();
    try {
      if (typeof cartId !== 'number') {
        throw new Error('Invalid input data; cartId MUST be a number.');
      }

      // Check if the cart exist?
      await this.getCartById(cartId);

      await client.query('BEGIN');

      await this.helpers.clearCartContent(client, cartId);

      await client.query('COMMIT');

    } catch (err) {
      await client.query('ROLLBACK');
      throw err;

    } finally {
      client.release();
    }
  },

  helpers: {
    clearCartContent: async function (client, cartId) {
      try {
        return await client.query(`
          DELETE FROM carts_products
          WHERE cart_id = $1
          RETURNING product_id, quantity;`,
          [cartId]
        );

      } catch (err) {
        throw err;
      }
    },

    getItemsBycartId: async function (client, cartId, include) {
      const results = await client.query(`
        SELECT
          product_id,
          quantity
        FROM carts_products
        WHERE cart_id = $1;`,
        [cartId]
      );

      const cartItems = await Promise.all(
        results.rows.map(async ({ product_id, quantity }) => {
          const product = include ? await products.getProductById(product_id, client) : null;
          return {
            productId: product_id,
            quantity,
            productInfo: product,
          };
        })
      );

      return cartItems;
    }
  }
}

module.exports = carts;