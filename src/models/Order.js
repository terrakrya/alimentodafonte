const mongoose = require('mongoose'),
  ObjectId = mongoose.Schema.Types.ObjectId,
  SeedItemSchema = require('./SeedItem');

const OrderSchema = mongoose.Schema({
  code: {
    type: Number,
    required: true
  },
  client: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  date_receiving: Date,
  deadline: Date,
  purchase_type: {
    type: String,
    default: 'Varejo'
  },
  contract: String,
  vegetation: String,
  restored_area: Number,
  bog: Boolean,
  flood: Boolean,
  amount_paid: Number,
  amount_remain: Number,
  seed_items: [SeedItemSchema],
}, {
  timestamps: true
});

mongoose.model('Order', OrderSchema);
