const pool = require('./database.js');
const help = require('./utils.js');

const productsModel = {

  createProduct: async function (productInfo, client) {
    const isClientDefined = client ? true : false;
    try {
      if (!isClientDefined) client = await pool.connect();

      this.validateProductInfo(productInfo);

      !isClientDefined && await client.query('BEGIN');

      const newProduct = await this.insertProduct(productInfo, client);

      await this.insertProductCategories(newProduct.id, productInfo.categories, client);

      !isClientDefined && await client.query('COMMIT');

      return { ...newProduct, categories: productInfo.categories };
    } catch (error) {
      !isClientDefined && await client.query('ROLLBACK');
      throw error;
    } finally {
      !isClientDefined && client.release();
    }
  },

  validateProductInfo: function (productInfo) {
    if (
      typeof productInfo !== 'object' ||
      typeof productInfo.name !== 'string' ||
      typeof productInfo.price !== 'number' ||
      typeof productInfo.quantity !== 'number' ||
      typeof productInfo.imageUrl !== 'string' ||
      !Array.isArray(productInfo.categories) ||
      productInfo.categories.length === 0
    ) {
      throw new help.MyError('Invalid product information', 400);
    }
  },

  insertProduct: async function (productInfo, client) {
    const { name, description, price, quantity, imageUrl } = productInfo;

    const result = await client.query(`
      INSERT INTO products (name, description, price, quantity, image_url)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;`,
      [name, description, price, quantity, imageUrl]
    );

    return help.convertKeysFromSnakeCaseToCamelCase(result.rows[0]);
  },

  insertProductCategories: async function (productId, categories, client) {
    const values = categories.map((categoryId) => `($1, ${categoryId})`).join(',');
    await client.query(`
      INSERT INTO categories_products (product_id, category_id) 
      VALUES ${values};`,
      [productId]
    );
  },

  getProducts: async function (client) {
    const isClientDefined = client ? true : false;
    try {
      if (!isClientDefined) client = await pool.connect();

      !isClientDefined && await client.query('BEGIN');

      const results = await pool.query('SELECT * FROM products');

      !isClientDefined && await client.query('COMMIT');

      const products = help.convertKeysFromSnakeCaseToCamelCase(results.rows);
      return products;
    } catch (error) {
      !isClientDefined && await client.query('ROLLBACK');
      throw error;
    } finally {
      !isClientDefined && client.release();
    }
  },

  getProductsByCategory: async function (categoryId, client) {
    const isClientDefined = client ? true : false;
    try {
      if (!isClientDefined) client = await pool.connect();

      !isClientDefined && await client.query('BEGIN');

      const results = await pool.query(`
        SELECT *
        FROM products
        INNER JOIN categories_products
        ON products.id = categories_products.product_id
        WHERE categories_products.category_id = $1;`,
        [categoryId]
      );

      !isClientDefined && await client.query('COMMIT');

      return results.rows;
    } catch (error) {
      !isClientDefined && await client.query('ROLLBACK');
      throw error;
    } finally {
      !isClientDefined && client.release();
    }
  },

  getProductById: async function (productId, client) {
    const isClientDefined = client ? true : false;
    try {
      if (!isClientDefined) client = await pool.connect();

      !isClientDefined && await client.query('BEGIN');

      const results = await client.query(`
      SELECT *
      FROM products
      WHERE id = $1;`,
        [productId]
      );

      if (results.rows.length === 0) throw new help.NotFound('product');

      const product = help.convertKeysFromSnakeCaseToCamelCase(results.rows[0]);
      const productCategories = await this.getProductCategories(productId, client);

      !isClientDefined && await client.query('COMMIT');

      return {
        ...product,
        categories: productCategories
      };
    } catch (error) {
      !isClientDefined && await client.query('ROLLBACK');
      throw error;
    } finally {
      !isClientDefined && client.release();
    }
  },

  updateProductById: async function (productId, productNewInfo, client) {
    const isClientDefined = client ? true : false;
    try {
      if (!isClientDefined) client = await pool.connect();

      !isClientDefined && await client.query('BEGIN');

      const columns = ['name', 'description', 'price', 'quantity', 'image_url'];
      const { updateFields, values, fieldsCount } = help.prepareUpdateFields(productNewInfo, columns);
      values.push(productId);

      const results = await client.query(`
        UPDATE products
        SET ${updateFields}
        WHERE id = $${fieldsCount}
        RETURNING *;`,
        values
      );

      if (productNewInfo.categories) {
        await this.updateProductCategories(productId, productNewInfo.categories, client);
      }

      const categories = await this.getProductCategories(productId, client);

      !isClientDefined && await client.query('COMMIT');

      if (results) {
        return {
          ...results.rows[0],
          categories
        };
      }

      return {
        categories
      }

    } catch (error) {
      !isClientDefined && await client.query('ROLLBACK');
      throw error;
    } finally {
      !isClientDefined && client.release();
    }
  },

  updateProductCategories: async function (productId, newCategories, client) {
    // get existCategories
    const existingCategories = await this.getProductCategories(productId, client);

    // get product's categories to DELETE FROM & INSERT INTO the database
    const categoriesToDelete = existingCategories.filter(categoryId => !newCategories.includes(categoryId));
    const categoriesToInsert = newCategories.filter(categoryId => !existingCategories.includes(categoryId));

    // check if there are some product's categories to delete and DELETE them FROM database
    if (categoriesToDelete.length > 0) {
      await this.deleteProductCategories(productId, categoriesToDelete, client);
    }

    // check if there are some product's categories to INSERT and INSERT them INTO database
    if (categoriesToInsert.length > 0) {
      await this.insertProductCategories(productId, categoriesToInsert, client);
    }
  },

  insertProductCategories: async function (productId, categoriesToInsert, client) {
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

  deleteProductCategories: async function (productId, categoriesToDelete, client) {
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

  deleteProductById: async function (productId, client) {
    const isClientDefined = client ? true : false;
    try {
      if (!isClientDefined) client = await pool.connect();

      !isClientDefined && await client.query('BEGIN');

      // delete product id from categories_products table.
      await client.query(`
        DELETE FROM categories_products
        WHERE product_id = $1;`,
        [productId]
      );

      // delete the product.
      const results = await client.query(`
        DELETE FROM products
        WHERE id = $1;`,
        [productId]
      );

      !isClientDefined && await client.query('COMMIT');

      if (results.rowCount === 0) throw new help.NotFound('product');
    } catch (error) {
      !isClientDefined && await client.query('ROLLBACK');
      throw error;
    } finally {
      !isClientDefined && client.release();
    }
  },

  // this helper function is used to retrieve all product categories by productId
  getProductCategories: async function (productId, client) {
    // get existCategories
    const results = await client.query(`
      SELECT category_id
      FROM categories_products
      WHERE product_id = $1;`,
      [productId]);

    const categories = results.rows.map(categories => {
      return categories.category_id;
    });

    return categories;
  }
}

module.exports = productsModel;