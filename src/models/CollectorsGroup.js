const mongoose = require('mongoose'),
  ObjectId = mongoose.Schema.Types.ObjectId,
  AddressSchema = require('./Address'),
  BankAccountSchema = require('./BankAccount');

const CollectorsGroupSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
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
  timestamps: true,
  toJSON: { virtuals: true }
});

CollectorsGroupSchema.virtual('collections', {
  ref: 'Collection',
  localField: '_id',
  foreignField: 'collectors_group'
});

CollectorsGroupSchema.virtual('collection_areas', {
  ref: 'CollectionArea',
  localField: '_id',
  foreignField: 'collectors_group'
});

CollectorsGroupSchema.virtual('collectors_requests', {
  ref: 'CollectorsRequest',
  localField: '_id',
  foreignField: 'collectors_group'
});

CollectorsGroupSchema.virtual('potential_lists', {
  ref: 'PotentialList',
  localField: '_id',
  foreignField: 'collectors_group'
});

CollectorsGroupSchema.virtual('seeds_matrixes', {
  ref: 'SeedsMatrix',
  localField: '_id',
  foreignField: 'collectors_group'
});

CollectorsGroupSchema.virtual('stock_ins', {
  ref: 'StockIn',
  localField: '_id',
  foreignField: 'collectors_group'
});

CollectorsGroupSchema.virtual('seeds_houses', {
  ref: 'SeedsHouse',
  localField: '_id',
  foreignField: 'collectors_groups'
});

mongoose.model('CollectorsGroup', CollectorsGroupSchema);
