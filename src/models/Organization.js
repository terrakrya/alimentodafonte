const mongoose = require('mongoose'),
  ObjectId = mongoose.Schema.Types.ObjectId,
  AddressSchema = require('./Address'),
  GeolocationSchema = require('./Geolocation'),
  ContactPersonSchema = require('./ContactPerson'),
  BankAccountSchema = require('./BankAccount');

const OrganizationSchema = mongoose.Schema({
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
  organization_types: [String],
  issue_invoice: Boolean
}, {
  timestamps: true,
  toJSON: { virtuals: true }
});

OrganizationSchema.virtual('users', {
  ref: 'User',
  localField: '_id',
  foreignField: 'organization'
});

OrganizationSchema.virtual('suppliers', {
  ref: 'Supplier',
  localField: '_id',
  foreignField: 'organizations'
});

mongoose.model('Organization', OrganizationSchema);
