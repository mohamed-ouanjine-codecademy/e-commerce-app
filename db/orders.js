const pool = require('./pool.js');
const help = require('./helperFunctions.js')

const orders = {
  getOrdersByUserId: async function (userId) {
    const client = await pool.connect();
    try {
      // input data validation
      if (typeof userId != 'number') {
        throw new Error('Invalid input data, userId must be a number');
      }

      await client.query('BEGIN');

      // get orders (id, created_at) by userId
      const results = await client.query(`
        SELECT
          id,
          created_at
        FROM orders
        WHERE user_id = $1`,
        [userId]
      );

      const orders = results.rows; // [{id: 1, created_at: 2023-12-12}, {id: 2, created_at: 2023-12-12} ]

      const ordersItems = Promise.all(orders.map(async (order) => {
        const orderId = order.id;

        const items = await this.helpers.getItemsByOrderId(client, orderId);
        // change product_id key to productId
        help.changeKeys(items, 'product_id', 'productId');

        return { ...order, items };
      }));

      await client.query('COMMIT');

      return ordersItems;

    } catch (err) {
      await client.query('ROLLBACK');
      throw err;

    } finally {
      client.release();
    }
  },

  getOrderByIdAndUserId: async function (userId, orderId) {
    const client = await pool.connect();
    try {
      if ((typeof userId != 'number') || (typeof orderId != 'number')) {
        throw new Error('Invalid input data! userId and OrderId must be a number');
      }

      await client.query('BEGIN');

      // get order by userId and orderId
      const results = await client.query(`
        SELECT created_at
        FROM orders
        WHERE user_id = $1
          AND id = $2`,
        [userId, orderId]
      );

      const orderInf = help.checkExistence(results, 'Order');

      // get order items (products)
      const items = await this.helpers.getItemsByOrderId(client, orderId);
      help.changeKeys(items, 'product_id', 'productId');

      await client.query('COMMIT');

      return {
        orderId,
        createdAt: orderInf.created_at,
        items
      }

    } catch (err) {
      await client.query('ROLLBACK');
      throw err;

    } finally {
      client.release();
    }
  },

  deleteOrderByIdAndUserId: async function (userId, orderId) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Delete order's items from orders_products
      const results1 = await client.query(`
        DELETE FROM orders_products
        WHERE order_id = $1
        RETURNING product_id, quantity;`,
        [orderId]
      );

      // Delete order by userId and orderId
      const results2 = await client.query(`
        DELETE FROM orders
        WHERE id = $1
          AND user_id = $2
        RETURNING *`,
        [orderId, userId]
      );

      // Check the order existeness and return the order if it does
      const order = help.checkExistence(results2, 'Order');

      // Store order' items and change product_id keyname to productId
      const items = results1.rows;
      help.changeKeys(items, 'product_id', 'productId');

      await client.query('COMMIT');

      return {
        orderId,
        createdAt: order.created_at,
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
    getItemsByOrderId: async function (client, orderId) {
      try {
        if (typeof orderId != 'number') {
          throw new Error('Invalid input data! orderId must be a number');
        }

        const results = await client.query(`
          SELECT
            product_id,
            quantity
          FROM orders_products
          WHERE order_id = $1`,
          [orderId]
        );

        return results.rows;

      } catch (err) {
        throw err;
      }
    }
  }
}

module.exports = orders;