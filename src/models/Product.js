const mongoose = require('mongoose'),
  ObjectId = mongoose.Schema.Types.ObjectId;

const ProductSchema = mongoose.Schema({
  organization: {
    type: ObjectId,
    ref: 'Organization',
  },
  producer: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  slug: {
    type: String
  },
  category: String,
  name: {
    type: String,
    required: true
  },
  images: [Object],
  description: String,
  tags: [Object],
  seasonality: [String],
  producer_price: Number,
  taxes: Number,
  final_price: Number,

}, {
  timestamps: true,
  toJSON: { virtuals: true }
});

ProductSchema.virtual('offers', {
  ref: 'Offer',
  localField: '_id',
  foreignField: 'product'
});

mongoose.model('Product', ProductSchema);
