// imports
const express = require('express');
const router = express.Router();

// -- utils
const db = require('../db/index.js');

// start
router.post('/', async (req, res, next) => {
  try {
    const { name, description, price } = req.body;

    const newProduct = await db.products.postProduct(name, description, price);

    res.json(newProduct);
  } catch (err) {
    next(err);
  }
});

router.get('/', async (req, res, next) => {
  try {
    let products;
    const categoryId = req.query.category;

    if (categoryId) {
      products = await db.products.getProductsByCategory(categoryId);
    } else {
      products = await db.products.getProducts();
    }

    res.json(products);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const productId = req.params.id;

    const product = await db.products.getProductById(productId);

    res.json(product);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const productId = req.params.id;
    const productUpdates = req.body;

    // this line is check if the product exist or not.
    await db.products.getProductById(productId);
    const newProduct = await db.products.updateProductById(productId, productUpdates);

    res.json(newProduct);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const productId = req.params.id;

    // check if the product exist
    await db.products.getProductById(productId);
    const deletedProduct = await db.products.deleteProductById(productId);

    res.json(deletedProduct);
  } catch (err) {
    next(err);
  }
});


module.exports = router;