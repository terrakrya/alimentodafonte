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
  }
}, {
  timestamps: true
});

mongoose.model('StockIn', StockInSchema);
