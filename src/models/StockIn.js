const mongoose = require('mongoose'),
  ObjectId = mongoose.Schema.Types.ObjectId,
  StockItemSchema = require('./StockItem');

const StockInSchema = mongoose.Schema({
  seeds_house: {
    type: ObjectId,
    ref: 'SeedsHouse',
    required: true
  },
  collectors_group: {
    type: ObjectId,
    ref: 'CollectorsGroup'
  },
  collector: {
    type: ObjectId,
    ref: 'User'
  },
  stock_items: [StockItemSchema],
  createdBy: {
    type: ObjectId,
    ref: 'User'
  },
  qtd: {
    type: Number,
  },
  collection_date: Date,
  price: {
    type: Number
  },
  compensation_collect: {
    type: Number,
  },
  wholesale_price: {
    type: Number
  },
  seed: {
    type: ObjectId,
    ref: 'Seed',
  },
  lot: {
    type: ObjectId,
    ref: 'Lot',
  }

}, {
  timestamps: true
});

mongoose.model('StockIn', StockInSchema);
