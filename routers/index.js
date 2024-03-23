const express = require('express');
const router = express.Router();
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

// Define Swagger options
const options = {
  definition: {
    openapi: '3.0.1',
    info: {
      title: 'My API',
      version: '1.0.0',
    },
    servers: [{ url: 'http://localhost:8000/api' }],
  },
  apis: ['./docs/openapi.yaml'], // Specify the path to your route files
};

const specs = swaggerJsdoc(options);

// Serve Swagger UI
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Mount routers
router.use('/user', require('./users.router'));
router.use('/product', require('./product.router'));
router.use('/cart', require('./cart.router'));
router.use('/order', require('./order.router'));
router.use('/auth', require('./auth.router'));
router.use('/shipping-address', require('./shippingAddress.router'));
router.use('/shipping-method', require('./deliveryMethods.router'));

// Root path
router.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    return res.json({ user: req.user });
  }
  return res.json({ status: 'success', data: {} });
});

module.exports = router;