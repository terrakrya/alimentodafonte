var mongoose = require('mongoose'),
  ObjectId = mongoose.Schema.Types.ObjectId;

var OfferItemSchema = new mongoose.Schema({
  product: {
    type: ObjectId,
    ref: 'Product',
    required: true
  },
  qtd: Number,
  price: Number,
  total: Number,
});

module.exports = OfferItemSchema;
