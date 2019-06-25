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
  images: [Object],
  user: {
    type: ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

mongoose.model('Seed', SeedSchema);
