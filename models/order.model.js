const pool = require('./database.js');
const help = require('./utils.js');
const productModel = require('./product.model.js');

const orderModel = {
  createOrder: async function (userId, cartId, client) {
    if (!client) client = pool;
    try {

      // create new order
      const results1 = await client.query(`
        INSERT INTO orders (user_id) VALUES
          ($1)
        RETURNING id, created_at, status;`,
        [userId]
      );
      const order = results1.rows[0];

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
        WHERE orders.id = $1;`,
        [order.id]
      );

      const newOrder = {
        ...order,
        created_at: `${order.created_at}`,
      }

      return help.convertKeysFromSnakeCaseToCamelCase(newOrder);
    } catch (error) {
      throw error;
    }
  },

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

      const orders = results.rows.map(order => {
        // Convert created_at from object to string.
        order.created_at = `${order.created_at}`;
        return order;
      }); // [{id: 1, created_at: 2023-12-12}, {id: 2, created_at: 2023-12-12} ]

      const ordersItems = await Promise.all(orders.map(async (order) => {
        const orderId = order.id;

        const items = await this.helpers.getItemsByOrderId(orderId, client);
        // change product_id key to productId

        return help.convertKeysFromSnakeCaseToCamelCase({ ...order, items });
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
        throw new Error('Invalid input data! userId and OrderId MUST be a number');
      }

      await client.query('BEGIN');

      // get order by userId and orderId
      const results = await client.query(`
        SELECT
          id,
          created_at,
          status
        FROM orders
        WHERE user_id = $1
          AND id = $2`,
        [userId, orderId]
      );

      const order = help.checkExistence(results, 'Order');

      // get order items (products)
      const items = await this.helpers.getItemsByOrderId(orderId, client);

      await client.query('COMMIT');

      return help.convertKeysFromSnakeCaseToCamelCase({
        ...order,
        created_at: `${order.created_at}`,
        items
      });

    } catch (err) {
      await client.query('ROLLBACK');
      throw err;

    } finally {
      client.release();
    }
  },

  updateStatus: async function (userId, orderId, status) {
    try {
      if ((typeof userId != 'number') || (typeof orderId != 'number') || !status) {
        throw new Error('Invalid input data! userId and OrderId MUST be a number and status MUST NOT be undefined');
      }

      const results = await pool.query(`
        UPDATE orders
        SET status = $3
        WHERE id = $2
          AND user_id = $1
        RETURNING
          id,
          created_at,
          status;`,
        [userId, orderId, status]
      );
      // Check exisitence
      const order = help.checkExistence(results, 'Order');

      return help.convertKeysFromSnakeCaseToCamelCase({
        ...order,
        created_at: `${order.created_at}`
      });

    } catch (err) {
      throw err;
    }
  },

  addItemToOrder: async function (userId, orderId, itemInfo) {
    try {
      // Check input data
      if (
        typeof userId !== 'number' ||
        typeof orderId !== 'number' ||
        typeof itemInfo !== 'object' ||
        typeof itemInfo.productId !== 'number' ||
        typeof itemInfo.quantity !== 'number'
      ) {
        throw {
          status: 400,
          message: 'Invalid request payload. Please check the data format.'
        };
      }

      // Check if the order belongs to the user
      await this.getOrderByIdAndUserId(userId, orderId);

      // Check if the product exists
      await productModel.getProductById(itemInfo.productId);

      // Add item to order
      await this.helpers.insertItemToOrder(orderId, itemInfo.productId, itemInfo.quantity);

      // Get order items
      const items = await this.helpers.getItemsByOrderId(orderId);

      return help.convertKeysFromSnakeCaseToCamelCase({
        success: true,
        message: 'Item successfully added to the order.',
        updatedOrder: {
          id: orderId,
          items
        }
      });
    } catch (err) {
      throw err;
    }
  },

  removeItemFromOrderd: async function (userId, orderId, productId) {
    try {
      // Check input data
      if (
        typeof userId !== 'number' ||
        typeof orderId !== 'number' ||
        typeof productId !== 'number'
      ) {
        throw {
          status: 400,
          message: 'Invalid request payload. Please check the data format.'
        };
      }

      // Check if the order belongs to the user
      await this.getOrderByIdAndUserId(userId, orderId);

      // Check if the product exists
      await productModel.getProductById(productId);

      // Check if the product exists in the order
      const item = await this.helpers.getItemByOrderIdAndProductId(orderId, productId);
      if (!item) {
        throw {
          status: 404,
          message: 'The specified product does not exist in the order'
        }
      }

      // Delete product from order
      await this.helpers.deleteItemFromOrder(orderId, productId);

    } catch (err) {
      throw err;
    }
  },

  updateOrderProductQuantity: async function (userId, orderId, productId, quantity) {
    try {
      // Check input data
      if (
        typeof userId !== 'number' ||
        typeof orderId !== 'number' ||
        typeof productId !== 'number' ||
        typeof quantity !== 'number'
      ) {
        throw {
          status: 400,
          message: 'Invalid request payload. Please check the data format.'
        };
      }

      // Check if the order belongs to the user
      await this.getOrderByIdAndUserId(userId, orderId);

      // Check if the product exists
      await productModel.getProductById(productId);

      // Check if the product exists in the order
      const item = await this.helpers.getItemByOrderIdAndProductId(orderId, productId);
      if (!item) {
        throw {
          status: 404,
          message: 'The specified product does not exist in the order'
        }
      }

      await pool.query(`
        UPDATE orders_products
        set quantity = $1
        WHERE order_id = $2
          AND product_id = $3;`,
        [quantity, orderId, productId]
      );

      return {
        success: true,
        message: "Item quantity updated successfully",
        updatedItem: {
          id: productId,
          quantity
        }
      }

    } catch (err) {
      throw err;
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

      return help.convertKeysFromSnakeCaseToCamelCase({
        id: orderId,
        created_at: order.created_at,
        status: order.status,
        items
      });

    } catch (err) {
      await client.query('ROLLBACK');
      throw err;

    } finally {
      client.release();
    }
  },

  helpers: {
    getItemsByOrderId: async function (orderId, client = pool) {
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
    },

    insertItemToOrder: async function (orderId, productId, quantity, client = pool) {
      try {
        // Insert item to order
        await client.query(`
          INSERT INTO orders_products (order_id, product_id, quantity) VALUES
            ($1, $2, $3);`,
          [orderId, productId, quantity]
        );
      } catch (err) {
        throw err;
      }
    },

    deleteItemFromOrder: async function (orderId, productId, client = pool) {
      try {
        const results = await client.query(`
          DELETE FROM orders_products
          WHERE order_id = $1
            AND product_id = $2
          RETURNING *;`,
          [orderId, productId]
        );

        return results.rows[0];

      } catch (err) {
        throw err;
      }
    },

    getItemByOrderIdAndProductId: async function (orderId, productId, client = pool) {
      try {
        // Get Item
        const results = await client.query(`
          SELECT *
          FROM orders_products
          WHERE order_id = $1
            AND product_id = $2`,
          [orderId, productId]
        );

        if (!results.rows) {
          return undefined;
        }

        return results.rows[0];

      } catch (err) {
        throw err;
      }
    }
  }
}

module.exports = orderModel;