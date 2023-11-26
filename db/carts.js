const pool = require('./pool.js');
const help = require('./helperFunctions.js');

const carts = {
  createCart: async function (userId) {
    try {
      const results = await pool.query(`
        INSERT INTO carts (user_id) VALUES
          ($1)
        RETURNING *;`,
        [userId]
      );

      return results.rows[0];

    } catch (err) {
      throw err;
    }
  },

  getCartById: async function (cartId) {
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
      const items = await this.helpers.getItemsBycartId(client, cartId);

      await client.query('COMMIT');

      return { ...cart, items };

    } catch (err) {
      await client.query('ROLLBACK');
      throw err;

    } finally {
      client.release();
    }
  },

  updateCartById: async function (cartId, item) {
    const client = await pool.connect();
    try {
      if ((typeof cartId != 'number') || !item) {
        throw new Error('Invalid input data');
      }

      await client.query('BEGIN');

      await client.query(`
        INSERT INTO carts_products VALUES
          ($1, $2, $3);`,
        [cartId, item.productId, item.quantity]
      );
      // get all row (product_id, quantity) related to the cart in carts_products table
      const items = await this.helpers.getItemsBycartId(client, cartId);

      await client.query('COMMIT');


      return { cartId: cartId, items };

    } catch (err) {
      await client.query('ROLLBACK');
      throw err;

    } finally {
      client.release();
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

      const results = await pool.query(`
        UPDATE carts_products
        SET quantity = $1
        WHERE cart_id = $2
          AND product_id = $3
        RETURNING *`,
        [quantity, cartId, productId]
      );

      return {
        success: results.rows.length > 0,
        updatedProduct: results.rows[0]
      };

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

      await client.query('BEGIN');

      // remove any row related to the cart in carts_products table
      const results = await this.helpers.clearCartContent(client, cartId);

      await client.query(`
        DELETE FROM carts
        WHERE id = $1;`,
        [cartId]
      );


      const items = results.rows;
      help.changeKeys(items, 'product_id', 'productId');

      await client.query('COMMIT');

      return {
        cartId,
        items
      }

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

      return {
        orderId,
        items
      }

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

    getItemsBycartId: async function (client, cartId) {
      const results = await client.query(`
        SELECT
          product_id,
          quantity
        FROM carts_products
        WHERE cart_id = $1;`,
        [cartId]
      );
      const items = results.rows;
      help.changeKeys(items, 'product_id', 'productId');
      return items;
    }
  }

}

module.exports = carts;