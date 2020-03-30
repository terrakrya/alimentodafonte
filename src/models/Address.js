var mongoose = require('mongoose');

var AddressSchema = new mongoose.Schema({
  location: {
    type: {
      type: String
    },
    coordinates: []
  },
  city: String,
  uf: String,
  street: String,
  neighborhood: String,
  complement: String,
  postal_code: String,
  description: String,
  source: Object
});

AddressSchema.index({ location: "2dsphere" });

module.exports = AddressSchema;
