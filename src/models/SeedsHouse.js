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
  timestamps: true
});

mongoose.model('SeedsHouse', SeedsHouseSchema);
