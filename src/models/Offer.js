const mongoose = require('mongoose'),
  ObjectId = mongoose.Schema.Types.ObjectId;

const OfferSchema = mongoose.Schema({
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
  product_variation: {
    type: ObjectId,
    ref: 'ProductVariation',
    required: true
  },
  lot: String,
  manufacturing_date: Date,
  source_of_shipment: String,
  final_price: Number,
}, {
  timestamps: true,
});

mongoose.model('Offer', OfferSchema);
