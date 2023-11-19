const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool(
  {
    user: 'me',
    host: 'localhost',
    database: 'e-commerce_app',
    password: process.env.ROLE_PASSWORD,
    port: 5432
  }
);

const users = {
  createUser: (req, res, next) => {
    const { email } = req.body;
    const hashedPassword = req.hashedPassword;
    pool.query('INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *', [email, hashedPassword], (err, results) => {
      if (err) {
        console.err('err in createUser', err);
        next(err);
      }
      res.status(201).json(results.rows[0]);
    })
  },

  findUserByEmail: async (email, callback) => {
    try {
      const results = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      callback(null, results.rows[0]);
    } catch (err) {
      callback(err)
      throw err
    }
  },

  findUserById: async (id, callback) => {
    try {
      const results = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
      return callback(null, results.rows[0]);
    } catch (err) {
      return callback(err);
    }
  }
}

const products = {
  postProduct: async (name, description, price) => {
    try {
      const results = await pool.query(`
        INSERT INTO products (name, description, price) VALUES
          ($1, $2, $3)
        RETURNING *;
        `,
        [name, description, price]
      )
      return results.rows[0];
    } catch (err) {
      throw err;
    }
  },

  getProducts: async () => {
    try {
      const results = await pool.query('SELECT * FROM products');
      return results.rows;
    } catch (err) {
      throw err
    }
  },

  getProductsByCategory: async (categoryId) => {
    try {
      const results = await pool.query(`
        SELECT *
        FROM products
        INNER JOIN categories_products
          ON products.id = categories_products.product_id
        WHERE categories_products.category_id = $1;`,
        [categoryId]
      );
      return results.rows;
    } catch (err) {
      throw err;
    }
  },

  getProductById: async (productId) => {
    try {
      const results = await pool.query(`
        SELECT *
        FROM products
        WHERE id = $1;`,
        [productId]
      );

      if (results.rows.length === 0) {
        const err = new Error('Product not found');
        err.status = 404;
        throw err;
      } else {
        return results.rows[0];
      }
    } catch (err) {
      throw err;
    }
  },

  updateProductById: async (productId, productUpdates) => {
    try {
      const results = await pool.query(`
        UPDATE products
        SET name = $1, description = $2, price = $3
        WHERE id = $4
        RETURNING *;`,
        [productUpdates.name, productUpdates.description, productUpdates.price, productId]
      );
      return results.rows[0];
    } catch (err) {
      throw err;
    }
  },

  deleteProductById: async (productId) => {
    try {
      const results = await pool.query(`
        DELETE FROM products
        WHERE id = $1
        RETURNING *;`,
        [productId]
      );
      return results.rows[0];
    } catch (err) {
      throw err;
    }
  }
}

module.exports = {
  pool,
  users,
  products
}
