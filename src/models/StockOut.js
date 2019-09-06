const mongoose = require('mongoose'),
  ObjectId = mongoose.Schema.Types.ObjectId;

const StockOutSchema = mongoose.Schema({
  price: {
    type: Number,
    required: true
  },
  qtd: {
    type: Number,
    required: true
  },
  out_mode: String,
  seeds_house: {
    type: ObjectId,
    ref: 'SeedsHouse',
    required: true
  },
  buyer: {
    type: ObjectId,
    ref: 'User'
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
  },
  createdBy: {
    type: ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

mongoose.model('StockOut', StockOutSchema);
