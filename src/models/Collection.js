const mongoose = require('mongoose'),
  ObjectId = mongoose.Schema.Types.ObjectId,
  GeolocationSchema = require('./Geolocation');

const CollectionSchema = mongoose.Schema({
  date_time: {
    type: Date,
    required: true
  },
  seed: {
    type: ObjectId,
    ref: 'Seed'
  },
  collector: {
    type: ObjectId,
    ref: 'User'
  },
  collectors_group: {
    type: ObjectId,
    ref: 'CollectorsGroup'
  },
  weight_gross: Number,
  weight_benef: Number,
  flowering: Date,
  geolocation: GeolocationSchema,
  images: [Object],
  audio: String,
  commentary: String,
}, {
  timestamps: true
});

mongoose.model('Collection', CollectionSchema);
