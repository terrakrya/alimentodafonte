const mongoose = require('mongoose'),
  ObjectId = mongoose.Schema.Types.ObjectId;

const OfferSchema = mongoose.Schema({
  organization: {
    type: ObjectId,
    ref: 'Organization',
    required: true
  },
  producer: {
    type: ObjectId,
    ref: 'Producer',
    required: true
  },
  product: {
    type: ObjectId,
    ref: 'Product',
    required: true
  },
  lot: String,
  manufacturing_date: Date,
  source_of_shipment: String,
  final_price: Number,
  qtd: Number,
  qtd_ordered: Number,
  invoice_issuer: String
}, {
  timestamps: true,
});

mongoose.model('Offer', OfferSchema);
