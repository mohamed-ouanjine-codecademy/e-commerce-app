const pool = require('./database.js');
const help = require('./helperFunctions.js');

const shippingMethodsModel = {
  getShippingMethods: async () => {
    try {
      const results = await pool.query(`SELECT * FROM shipping_methods;`);
      const shippingMethods = help.transformKeys(results.rows);
      shippingMethods.forEach(method => {
        method.price = parseFloat(method.price);
      });
      
      return shippingMethods;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = shippingMethodsModel;