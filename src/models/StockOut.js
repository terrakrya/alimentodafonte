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
    ref: 'SeedsHouse'
  },
  buyer: {
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

mongoose.model('StockOut', StockOutSchema);
