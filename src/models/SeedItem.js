var mongoose = require('mongoose'),
  ObjectId = mongoose.Schema.Types.ObjectId;

var SeedItemSchema = new mongoose.Schema({
  qtd: {
    type: Number,
    required: true
  },
  compensation_collect: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  wholesale_price: {
    type: Number,
    required: true
  },
  seed: {
    type: ObjectId,
    ref: 'Seed'
  }
});

module.exports = SeedItemSchema;
