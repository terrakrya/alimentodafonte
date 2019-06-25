const mongoose = require('mongoose'),
  ObjectId = mongoose.Schema.Types.ObjectId,
  GeolocationSchema = require('./Geolocation');

const SeedsMatrixSchema = mongoose.Schema({
  code: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  source: {
    type: String,
    required: true
  },
  scientific_name: String,
  description: String,
  collec_months: [Number],
  geolocation: GeolocationSchema,
  collectors_group: {
    type: ObjectId,
    ref: 'CollectorsGroup'
  },
  collector: {
    type: ObjectId,
    ref: 'User'
  },
  documents: [Object],
}, {
  timestamps: true
});

mongoose.model('SeedsMatrix', SeedsMatrixSchema);
