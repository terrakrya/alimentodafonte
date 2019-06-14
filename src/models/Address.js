var mongoose = require('mongoose');

var AddressSchema = new mongoose.Schema({
  uf: { type: String, required: true },
  city: String,
  postal_code: String,
  address: { type: String, required: true }
});

module.exports = AddressSchema;
