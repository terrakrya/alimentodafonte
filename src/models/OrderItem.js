var mongoose = require('mongoose'),
  ObjectId = mongoose.Schema.Types.ObjectId;

var OrderItemSchema = new mongoose.Schema({
  offer: {
    type: ObjectId,
    ref: 'Offer',
    required: true
  },
  qtd: Number,
  price: Number,
  total: Number,
});

module.exports = OrderItemSchema;
