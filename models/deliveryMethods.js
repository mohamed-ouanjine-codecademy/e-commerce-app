const pool = require('./database.js');
const help = require('./helperFunctions.js');

const deliveryMethodsModel = {
  getDeliveryMethods: async () => {
    try {
      const results = await pool.query(`SELECT * FROM shipping_methods;`);
      const deliveryMethods = help.transformKeys(results.rows);
      deliveryMethods.forEach(method => {
        method.price = parseFloat(method.price);
      });
      
      return deliveryMethods;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = deliveryMethodsModel;