// imports
const express = require('express');
const router = express.Router();

// -- utils
const products = require('../models/products');

// start
router.post('/', async (req, res, next) => {
  try {
    const productInfo = req.body;

    const newProduct = await products.postProduct(productInfo);

    res.status(201).json(newProduct);

  } catch (err) {
    next(err);
  }
});

router.get('/', async (req, res, next) => {
  try {
    let productsResult;
    const categoryId = req.query.categoryId;

    if (categoryId) {
      productsResult = await products.getProductsByCategory(categoryId);
    } else {
      productsResult = await products.getProducts();
    }

    res.json(productsResult);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const productId = req.params.id;

    const product = await products.getProductById(productId);

    res.json({
      status: 'success',
      message: 'product retrieved successfully',
      data: product
    });
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const productId = req.params.id;
    const productNewInfo = req.body;

    const updatedProduct = await products.updateProductById(productId ,productNewInfo);

    res.json(updatedProduct);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const productId = req.params.id;

    const deletedProduct = await products.deleteProductById(productId);

    res.json(deletedProduct);
  } catch (err) {
    next(err);
  }
});


module.exports = router;