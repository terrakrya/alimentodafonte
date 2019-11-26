const mongoose = require('mongoose'),
  ObjectId = mongoose.Schema.Types.ObjectId;

const ProductVariationSchema = mongoose.Schema({
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

  manufacturing_date: Date,
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
  box_gross_weight:Object,
  box_max_stack: Number,

  published: Boolean,

}, {
  timestamps: true,
});

mongoose.model('ProductVariation', ProductVariationSchema);
