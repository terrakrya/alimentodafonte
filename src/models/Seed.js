const mongoose = require('mongoose'),
  ObjectId = mongoose.Schema.Types.ObjectId;

const SeedSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  scientific_name: {
    type: String,
    required: true
  },
  local_name: String,
  description: String,
  price: {
    type: Number,
    required: true
  },
  wholesale_price: {
    type: Number,
    required: true
  },
  stock: {
    type: Number,
    default: 0
  },
  seeds_kg: {
    type: Number,
    required: true
  },
  viability_rate: {
    type: Number,
    required: true
  },
  lot_limit: Number,
  compensation_collect: Number,
  ecosystem: [String],
  fruiting_season: [String],
  images: [Object]
}, {
  timestamps: true,
  toJSON: { virtuals: true }
});

SeedSchema.virtual('potential_lists', {
  ref: 'PotentialList',
  localField: '_id',
  foreignField: 'seed_items.seed'
});

SeedSchema.virtual('orders', {
  ref: 'Order',
  localField: '_id',
  foreignField: 'seed_items.seed'
});

SeedSchema.virtual('collectors_requests', {
  ref: 'CollectorsRequest',
  localField: '_id',
  foreignField: 'seed_items.seed'
});

SeedSchema.virtual('collectors_groups', {
  ref: 'CollectorsGroup',
  localField: '_id',
  foreignField: 'seeds'
});

SeedSchema.virtual('collections', {
  ref: 'Collection',
  localField: '_id',
  foreignField: 'seed'
});

SeedSchema.virtual('stock_ins', {
  ref: 'StockIn',
  localField: '_id',
  foreignField: 'seed'
});

SeedSchema.virtual('stock_outs', {
  ref: 'StockOut',
  localField: '_id',
  foreignField: 'seed'
});

mongoose.model('Seed', SeedSchema);
