// imports
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const router = require('express').Router();

// -- Routers
const authRouter = require('./auth');
const usersRouter = require('./users.js');
const productsRouter = require('./products.js');
const cartsRouter = require('./carts.js');
const ordersRouter = require('./orders.js');
const shippingAddressesRouter = require('./shippingAddresses.js');
const shippingMethodsRouter = require('./shippingMethods.js');

// Define Swagger JSdoc options
const options = {
  definition: {
    openapi: '3.0.1',
    info: {
      title: 'My API',
      version: '1.0.0',
    },
  },
  apis: ['./docs/openapi.yaml'], // Specify the path to your route files
};

const specs = swaggerJsdoc(options);

// Serve Swagger UI
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// mount routers
router.use('/users', usersRouter);
router.use('/products', productsRouter);
router.use('/carts', cartsRouter);
router.use('/orders', ordersRouter);
router.use('/auth', authRouter);
router.use('/shipping-addresses', shippingAddressesRouter);
router.use('/shipping-methods', shippingMethodsRouter);

// root path
router.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    return res.json({user: req.user});
  }
  return res.json({
    status: 'success',
    data: {}
  });
});

module.exports = router;