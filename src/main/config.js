const dotenv = require('dotenv');
const customerSchema = require('../utils/validation');

dotenv.config();

module.exports = {
  baseUrl: process.env.BASE_URL,
  customerSchema: customerSchema
};
