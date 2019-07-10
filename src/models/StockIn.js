const mongoose = require('mongoose'),
  ObjectId = mongoose.Schema.Types.ObjectId;

const StockInSchema = mongoose.Schema({
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
  qtd: {
    type: Number,
    required: true
  },
  collection_date: Date,
  seeds_house: {
    type: ObjectId,
    ref: 'SeedsHouse'
  },
  collectors_group: {
    type: ObjectId,
    ref: 'CollectorsGroup'
  },
  collector: {
    type: ObjectId,
    ref: 'User'
  },
  seed: {
    type: ObjectId,
    ref: 'Seed'
  },
  lot: {
    type: ObjectId,
    ref: 'Lot'
  }
}, {
  timestamps: true
});

mongoose.model('StockIn', StockInSchema);
