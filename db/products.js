const pool = require('./pool.js');
const help = require('./helperFunctions.js');

const products = {

  postProduct: async function (productInfo) {
    const client = await pool.connect();

    try {
      // check input data
      if (
        !productInfo ||
        !productInfo.name ||
        (typeof productInfo.price != 'number') ||
        !Array.isArray(productInfo.categoriesId) ||
        productInfo.categoriesId.length === 0
      ) {
        const err = new Error('Invalid input data');
        err.status = 400;
        throw err;
      }

      await client.query('BEGIN');

      // Insert product productInfo into products table
      const productResults = await client.query(`
        INSERT INTO products (name, description, price) VALUES
          ($1, $2, $3)
        RETURNING *;`,
        [productInfo.name, productInfo.description, productInfo.price]
      );
      const newProduct = productResults.rows[0];

      // Insert product categories into categories_products table
      for (const categoryId of productInfo.categoriesId) {
        await client.query(`
        INSERT INTO categories_products (category_id, product_id) VALUES
          ($1, $2);`,
          [categoryId, newProduct.id]
        );
      }

      await client.query('COMMIT');

      // return created product
      return {
        ...newProduct,
        categoriesId: productInfo.categoriesId
      };

    } catch (err) {
      await client.query('ROLLBACK');
      throw err;

    } finally {
      client.release();
    }
  },

  getProducts: async function () {
    try {
      const results = await pool.query('SELECT * FROM products');

      return results.rows;

    } catch (err) {
      throw err
    }
  },

  getProductsByCategory: async function (categoryId) {
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

  getProductById: async function (productId) {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      const results = await client.query(`
        SELECT *
        FROM products
        WHERE id = $1;`,
        [productId]
      );
      // check if the product exist
      const product = help.checkExistence(results, 'Product');

      // retrieve product's categories and attach it to product object
      product.categoriesId = await this.getProductCategories(client, productId);

      await client.query('COMMIT');

      return product;

    } catch (err) {
      await client.query('ROLLBACK');
      throw err;

    } finally {
      client.release();
    }
  },

  updateProductById: async function (productId, productNewInfo) {
    const client = await pool.connect();

    try {
      await this.getProductById(productId);

      let results;
      await client.query('BEGIN');

      // setup the products table modifications objects
      const updateFields = [];
      const values = [];
      const keys = ['name', 'description', 'price'];
      let fieldsCount = 1;

      // check if the product's keys that will be updated (e.g. name, description...)
      for (let key of keys) {
        if (productNewInfo[key]) {
          updateFields.push(`${key} = $${fieldsCount}`);
          values.push(productNewInfo[key]);
          fieldsCount++;
        }
      }
      values.push(productId);

      // check if there something to updated and updated it in database
      if (updateFields.length > 0) {
        results = await client.query(`
          UPDATE products
          SET ${updateFields.join(', ')}
          WHERE id = $${fieldsCount}
          RETURNING *;`,
          values
        );
      }

      // start of product's categories updates
      await this.updateProductCategories(client, productId, productNewInfo.categoriesId);
      // end of product's categories updates

      // retrieve product's categories and attach it to product object
      const categoriesId = await this.getProductCategories(client, productId);

      await client.query('COMMIT');

      if (results) {
        return {
          ...results.rows[0],
          categoriesId
        };
      }

      return {
        categoriesId
      }

    } catch (err) {
      await client.query('ROLLBACK');
      throw err;

    } finally {
      client.release();
    }
  },

  updateProductCategories: async function (client, productId, newCategories) {
    // get existCategories
    const existingCategories = await this.getProductCategories(client, productId);

    // get product's categories to DELETE FROM & INSERT INTO the database
    const categoriesToDelete = existingCategories.filter(categoryId => !newCategories.includes(categoryId));
    const categoriesToInsert = newCategories.filter(categoryId => !existingCategories.includes(categoryId));

    // check if there are some product's categories to delete and DELETE them FROM database
    if (categoriesToDelete.length > 0) {
      await this.deleteProductCategories(client, productId, categoriesToDelete);
    }

    // check if there are some product's categories to INSERT and INSERT them INTO database
    if (categoriesToInsert.length > 0) {
      await this.insertProductCategories(client, productId, categoriesToInsert);
    }
  },

  insertProductCategories: async function (client, productId, categoriesToInsert) {
    const updateFields = [];
    const values = [...categoriesToInsert, productId];
    const productIdPosition = values.length;

    // populate updateFields array.
    for (let i = 1; i <= categoriesToInsert.length; i++) {
      updateFields.push(`($${i}, $${productIdPosition})`);
    }

    // insert categories into the database
    await client.query(`
      INSERT INTO categories_products (category_id, product_id) VALUES
        ${updateFields.join(', ')};`,
      values
    );
  },

  deleteProductCategories: async function (client, productId, categoriesToDelete) {
    const updateFields = [];
    const values = [...categoriesToDelete, productId];

    // populate updateFields array.
    for (let i = 1; i <= categoriesToDelete.length; i++) {
      updateFields.push(`category_id = $${i}`);
    }

    // delete categories frome the database
    await client.query(`
      DELETE FROM categories_products
      WHERE product_id = $${values.length} AND (${updateFields.join(' OR ')});`,
      values
    );
  },

  deleteProductById: async function (productId) {
    const client = await pool.connect();

    try {
      // check the existence of the product
      await this.getProductById(productId);

      await client.query('BEGIN');

      await client.query(`
        DELETE FROM categories_products
        WHERE product_id = $1;`,
        [productId]
      );

      const results = await client.query(`
        DELETE FROM products
        WHERE id = $1
        RETURNING *;`,
        [productId]
      );

      await client.query('COMMIT');

      return results.rows[0];

    } catch (err) {
      await client.query('ROLLBACK');
      throw err;

    } finally {
      client.release();
    }
  },

  // this helper function is used to retrieve all product categories by productId
  getProductCategories: async function (client, productId) {
    // get existCategories
    const results = await client.query(`
      SELECT category_id
      FROM categories_products
      WHERE product_id = $1;`,
      [productId]);

    const categoriesId = results.rows.map(categories => {
      return categories.category_id;
    });

    return categoriesId;
  }
}

module.exports = products;