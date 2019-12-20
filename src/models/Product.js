const mongoose = require('mongoose'),
  ObjectId = mongoose.Schema.Types.ObjectId;

const ProductSchema = mongoose.Schema({
  organization: {
    type: ObjectId,
    ref: 'Organization', 
    required: true
  },
  supplier: {
    type: ObjectId,
    ref: 'Supplier',
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
  history: String,
  certifications: [Object],
  seasonality: [String],

}, {
  timestamps: true,
  toJSON: { virtuals: true }
});

ProductSchema.virtual('product_variations', {
  ref: 'ProductVariation',
  localField: '_id',
  foreignField: 'product'
});

mongoose.model('Product', ProductSchema);
