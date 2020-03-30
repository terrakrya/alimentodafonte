const mongoose = require('mongoose'),
  ObjectId = mongoose.Schema.Types.ObjectId,
  AddressSchema = require('./Address'),
  OfferItemSchema = require('./OfferItem');

const OfferSchema = mongoose.Schema({
  organization: {
    type: ObjectId,
    ref: 'Organization'
  },
  producer: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  offer_type: String,
  product: {
    type: ObjectId,
    ref: 'Product',
  },
  basket: [OfferItemSchema],
  name: String,
  description: String,
  images: [Object],
  lot: String,
  manufacturing_date: Date,
  source_of_shipment: AddressSchema,
  price: Number,
  taxes: Number,
  final_price: Number,
  qtd: Number,
  qtd_ordered: Number,
  shipping_types: [String],
  published: Boolean
}, {
  timestamps: true,
});

mongoose.model('Offer', OfferSchema);
