const mongoose = require('mongoose'),
  ObjectId = mongoose.Schema.Types.ObjectId;

const LotSchema = mongoose.Schema({
  code: {
    type: String,
    required: true
  },
  seeds_house: {
    type: ObjectId,
    ref: 'SeedsHouse'
  },
  seed: {
    type: ObjectId,
    ref: 'Seed'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true }
});

LotSchema.virtual('stock_ins', {
  ref: 'StockIn',
  localField: '_id',
  foreignField: 'lot'
});

LotSchema.virtual('stock_outs', {
  ref: 'StockOut',
  localField: '_id',
  foreignField: 'lot'
});

mongoose.model('Lot', LotSchema);
