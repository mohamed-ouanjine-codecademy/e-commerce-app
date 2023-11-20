const pool = require('./pool.js');
const help = require('./helperFunctions.js');

const products = {

  postProduct: async function (productInf) {
    const client = await pool.connect();

    try {
      // check input data
      if (!productInf || !productInf.name || !productInf.price || !productInf.categoriesId || !Array.isArray(productInf.categoriesId)) {
        throw new Error('Invalid input data');
      }

      await client.query('BEGIN');

      // Insert product productInf into products table
      const productResults = await client.query(`
        INSERT INTO products (name, description, price) VALUES
          ($1, $2, $3)
        RETURNING *;`,
        [productInf.name, productInf.description, productInf.price]
      );
      const productId = productResults.rows[0].id;

      // Insert product categories into categories_products table
      for (const categoryId of productInf.categoriesId) {
        await client.query(`
        INSERT INTO categories_products (category_id, product_id) VALUES
          ($1, $2);`,
          [categoryId, productId]
        );
      }

      await client.query('COMMIT');

      // return created product
      return {
        ...productResults.rows[0],
        categoriesId: productInf.categoriesId
      };

    } catch (error) {
      await client.query('ROLLBACK');
      console.error(err);
      throw error;

    } finally {
      client.release();
    }
  },

  getProducts: async function () {
    try {
      const results = await pool.query('SELECT * FROM products');

      return results.rows;

    } catch (err) {
      console.error(err);
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
      console.error(err);
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
      console.error(err);
      throw err;

    } finally {
      client.release();
    }
  },

  updateProductById: async function (productId, productNewInf) {
    const client = await pool.connect();

    try {
      await this.getProductById(productId);

      let results;
      await client.query('BEGIN');

      // setup the products table modifications objects
      const updateFields = [];
      const values = [];
      let fieldsCount = 1;

      // check if the product's name will updated
      if (productNewInf.name) {
        updateFields.push(`name = $${fieldsCount}`);
        values.push(productNewInf.name);
        fieldsCount++;
      }

      // check if the product's description will updated
      if (productNewInf.description) {
        updateFields.push(`description = $${fieldsCount}`);
        values.push(productNewInf.description);
        fieldsCount++;
      }

      // check if the product's price will updated
      if (productNewInf.price) {
        updateFields.push(`price = $${fieldsCount}`);
        values.push(productNewInf.price);
        fieldsCount++;
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
      await this.updateProductCategories(client, productId, productNewInf.categoriesId);
      // end of product's categories updates

      await client.query('COMMIT');

      return await this.getProductById(productId);;

    } catch (err) {
      await client.query('ROLLBACK');
      console.error(err);
      throw err;

    } finally {
      client.release();
    }
  },

  updateProductCategories: async function (client, productId, newCategories) {
    // get existCategories
    const existingCategories = await this.getProductCategories(client, productId);

    // get newCategories

    // get product's categories to DELETE FROM database
    // & get product's categories to INSERT INTO database
    const categoriesToDelete = existingCategories.filter(categoryId => !newCategories.includes(categoryId));
    const categoriesToInsert = newCategories.filter(categoryId => !existingCategories.includes(categoryId));

    // check if there some product's categories to delete and DELETE them FROM database
    if (categoriesToDelete.length > 0) {
      await this.deleteProductCategories(client, productId, categoriesToDelete);
    }

    // check if there some product's categories to INSERT and INSERT them INTO database
    if (categoriesToInsert.length > 0) {
      await this.insertProductCategories(client, productId, categoriesToInsert);
    }
  },

  insertProductCategories: async function (client, productId, categoriesToInsert) {
    for (const categoryId of categoriesToInsert) {
      await client.query(`
        INSERT INTO categories_products (category_id, product_id) VALUES
          ($1, $2);`,
        [categoryId, productId]
      );
    }
  },

  deleteProductCategories: async function (client, productId, categoriesToDelete) {
    const updateFields = [];
    const values = [...categoriesToDelete, productId];

    // field updateFields.
    for (let i = 1; i <= categoriesToDelete.length; i++) {
      updateFields.push(`category_id = $${i}`);
    }

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
      console.error(err);
      throw err;

    } finally {
      client.release();
    }
  },

  // this helper function is used to retrieve all product categories by productId
  getProductCategories: async function (client, productId) {
    // get existCategories
    const existCategories = await client.query(`
      SELECT category_id
      FROM categories_products
      WHERE product_id = $1;`,
      [productId]);

    const existCategoriesArray = existCategories.rows.map(categoryObject => {
      return categoryObject.category_id;
    });
    console.log(existCategoriesArray);
    return existCategoriesArray;
  }
}

module.exports = products;