const mongoose = require('mongoose'),
  ObjectId = mongoose.Schema.Types.ObjectId,
  SeedItemSchema = require('./SeedItem');

const CollectorsRequestSchema = mongoose.Schema({
  code: {
    type: Number,
    required: true
  },
  collectors_group: {
    type: ObjectId,
    ref: 'CollectorsGroup'
  },
  collector: {
    type: ObjectId,
    ref: 'User'
  },
  seed_items: [SeedItemSchema],
  createdBy: {
    type: ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

mongoose.model('CollectorsRequest', CollectorsRequestSchema);
