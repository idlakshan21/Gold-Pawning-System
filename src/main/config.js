const dotenv = require('dotenv');
const customerSchema = require('../utils/validation');
const customerDetails=require('../renderer/scripts/customer-details')

dotenv.config();

module.exports = {
  baseUrl: process.env.BASE_URL,
  customerSchema: customerSchema,
  customer:customerDetails
};
