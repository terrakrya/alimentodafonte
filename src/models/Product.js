const mongoose = require('mongoose'),
  ObjectId = mongoose.Schema.Types.ObjectId;

const ProductSchema = mongoose.Schema({
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

  manufacturing_date: Date,
  duration: Object,

  tags: [String],

  producer_price: Number,
  minimum_quantity_for_shipping: Number,
  taxes: Number,
  final_price: Number,

  ncm: String,
  gross_weight: Number,
  net_weight: Number,
  bar_code: String,
}, {
  timestamps: true,
});

mongoose.model('Product', ProductSchema);
