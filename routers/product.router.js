const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');

router.post('/', productController.postProduct);
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);
router.put('/:id', productController.updateProductById);
router.delete('/:id', productController.deleteProductById);

module.exports = router;