const mongoose = require('mongoose'),
  ObjectId = mongoose.Schema.Types.ObjectId,
  AddressSchema = require('./Address'),
  BankAccountSchema = require('./BankAccount');


const CollectorsGroupSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  body: String,
  cnpj: String,
  contact: {
    type: String,
    required: true
  },
  address: AddressSchema,
  bank_account: BankAccountSchema,
  seeds: [{
    type: ObjectId,
    ref: 'Seed'
  }],
  collectors: [{
    type: ObjectId,
    ref: 'User'
  }],
}, {
  timestamps: true
});

mongoose.model('CollectorsGroup', CollectorsGroupSchema);
