const mongoose = require('mongoose'),
  ObjectId = mongoose.Schema.Types.ObjectId;

const ProductVariationSchema = mongoose.Schema({
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
  product: {
    type: ObjectId,
    ref: 'Product',
    required: true
  },
  slug: {
    type: String
  },
  name: {
    type: String,
    required: true
  },
  description: String,
  images: [Object],

  duration: Object,
  tags: [Object],

  producer_price: Number,
  taxes: Number,
  final_price: Number,

  minimum_quantity_for_shipping: Object,
  gross_weight: Object,
  net_weight: Object,
  ncm: String,
  bar_code: String,

  box_weight: Object,
  box_height: Object,
  box_width: Object,
  box_gross_weight: Object,
  box_max_stack: Number,

}, {
  timestamps: true,
  toJSON: {
    virtuals: true
  }
});

ProductVariationSchema.virtual('offers', {
  ref: 'Offer',
  localField: '_id',
  foreignField: 'product_variation'
});

mongoose.model('ProductVariation', ProductVariationSchema);
