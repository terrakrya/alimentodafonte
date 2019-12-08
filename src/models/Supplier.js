const mongoose = require('mongoose'),
  ObjectId = mongoose.Schema.Types.ObjectId,
  AddressSchema = require('./Address'),
  GeolocationSchema = require('./Geolocation'),
  ContactPersonSchema = require('./ContactPerson'),
  BankAccountSchema = require('./BankAccount');

const SupplierSchema = mongoose.Schema({
  organizations: [{
    type: ObjectId,
    ref: 'Organization'
  }],
  slug: {
    type: String
  },
  cnpj: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  corporate_name: {
    type: String,
    required: true
  },
  description: String,
  history: String,
  images: [Object],
  links: [Object],
  address: AddressSchema,
  geolocation: GeolocationSchema,
  email: String,
  phones: [String],
  whatsapp: [String],
  contact_persons: [ContactPersonSchema],
  bank_account: BankAccountSchema,
  legal_format: String,
  tax_regime: String,
  subscription: String,
  state_registration: String,
}, {
  timestamps: true,
  toJSON: { virtuals: true }
});

SupplierSchema.virtual('products', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'supplier'
});

mongoose.model('Supplier', SupplierSchema);
