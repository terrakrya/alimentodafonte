const mongoose = require('mongoose'),
  ObjectId = mongoose.Schema.Types.ObjectId,
  AddressSchema = require('./Address');

const SeedsHouseSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: String,
  phone: String,
  address: AddressSchema,
  owner: {
    type: ObjectId,
    ref: 'User'
  },
  collectors: [{
    type: ObjectId,
    ref: 'User'
  }],
  collectors_groups: [{
    type: ObjectId,
    ref: 'CollectorsGroup'
  }],
}, {
  timestamps: true,
  toJSON: { virtuals: true }
});

SeedsHouseSchema.virtual('lots', {
  ref: 'Lot',
  localField: '_id',
  foreignField: 'seeds_house'
});

SeedsHouseSchema.virtual('stock_ins', {
  ref: 'StockIn',
  localField: '_id',
  foreignField: 'seeds_house'
});

SeedsHouseSchema.virtual('stock_outs', {
  ref: 'StockOut',
  localField: '_id',
  foreignField: 'seeds_house'
});

mongoose.model('SeedsHouse', SeedsHouseSchema);
