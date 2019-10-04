var mongoose = require('mongoose'),
  ObjectId = mongoose.Schema.Types.ObjectId;

var SeedItemSchema = new mongoose.Schema({
  qtd: {
    type: Number,
    required: true
  },
  collection_date: Date,
  price: {
    type: Number
  },
  compensation_collect: {
    type: Number,
    required: true
  },
  wholesale_price: {
    type: Number
  },
  seed: {
    type: ObjectId,
    ref: 'Seed',
    required: true
  },
  lot: {
    type: ObjectId,
    ref: 'Lot',
    required: true
  }

});

module.exports = SeedItemSchema;
