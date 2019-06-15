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
  local_name: {
    type: String,
    required: true
  },
  description: String,
  price: {
    type: Number,
    required: true
  },
  wholesale_price: {
    type: Number,
    required: true
  },
  stock: Number,
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
  ecosystem: {
    type: [String],
    required: true
  },
  fruiting_season: {
    type: [String],
    required: true
  },
  images: [Object],
  user: {
    type: ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

mongoose.model('Seed', SeedSchema);
