const mongoose = require('mongoose'),
  ObjectId = mongoose.Schema.Types.ObjectId,
  GeolocationSchema = require('./Geolocation');
  AddressSchema = require('./Address');

const CollectionAreaSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  estimated_area: Number,
  geolocation: GeolocationSchema,
  address: AddressSchema,
  collector: {
    type: ObjectId,
    ref: 'User'
  },
  collectors_group: {
    type: ObjectId,
    ref: 'CollectorsGroup'
  },
  documents: [Object],
}, {
  timestamps: true
});

mongoose.model('CollectionArea', CollectionAreaSchema);
