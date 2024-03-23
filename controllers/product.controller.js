const productModel = require('../models/product.model');

const productsController = {
  postProduct: async (req, res, next) => {
    try {
      const productInfo = req.body;
      const newProduct = await productModel.createProduct(productInfo);

      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: newProduct
      });
    } catch (error) {
      next(error);
    }
  },

  getProducts: async (req, res, next) => {
    try {
      let productsResult;
      const categoryId = req.query.categoryId;

      if (categoryId) {
        productsResult = await productModel.getProductsByCategory(categoryId);
      } else {
        productsResult = await productModel.getProducts();
      }

      res.json({
        success: true,
        message: 'Products retrieved successfully',
        data: productsResult
      });
    } catch (error) {
      next(error);
    }
  },

  getProductById: async (req, res, next) => {
    try {
      const productId = req.params.id;
      const product = await productModel.getProductById(productId);

      res.json({
        success: true,
        message: 'Product retrieved successfully',
        data: product
      });
    } catch (error) {
      next(error);
    }
  },

  updateProductById: async (req, res, next) => {
    try {
      const productId = req.params.id;
      const productNewInfo = req.body;
      const updatedProduct = await productModel.updateProductById(productId, productNewInfo);

      res.json({
        success: true,
        message: 'Product updated successfully',
        data: updatedProduct
      });
    } catch (error) {
      next(error);
    }
  },

  deleteProductById: async (req, res, next) => {
    try {
      const productId = req.params.id;

      await productModel.deleteProductById(productId);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
};

module.exports = productsController;