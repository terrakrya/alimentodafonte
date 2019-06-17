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
  timestamps: true
});

mongoose.model('Lot', LotSchema);
