var mongoose = require('mongoose'),
  uniqueValidator = require('mongoose-unique-validator'),
  crypto = require('crypto'),
  jwt = require('jsonwebtoken'),
  secret = require('../config').secret,
  ObjectId = mongoose.Schema.Types.ObjectId,
  AddressSchema = require('./Address'),
  BankAccountSchema = require('./BankAccount');

mongoose.set('useCreateIndex', true)

var UserSchema = new mongoose.Schema({
  cnpj: {
    type: String,
    lowercase: true,
    match: [/^[a-zA-Z0-9]+$/, 'inválido'],
    index: true
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, 'inválido'],
    index: {
      unique: true,
      partialFilterExpression: { email: { $type: 'string' } },
    },
    default: null
  },
  hash: String,
  salt: String,
  name: String,
  roles: [String],
  image: Object,
  organization: {
    type: ObjectId,
    ref: 'Organization'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true }
});

UserSchema.plugin(uniqueValidator, {
  message: 'já está sendo usado'
});

UserSchema.methods.validPassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  return this.hash === hash;
};

UserSchema.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

UserSchema.methods.generateJWT = function() {
  var today = new Date();
  var exp = new Date(today);
  exp.setDate(today.getDate() + 60);

  return jwt.sign({
    id: this._id,
    cnpj: this.cnpj,
    roles: this.roles,
    exp: parseInt(exp.getTime() / 1000),
  }, secret);
};

UserSchema.methods.toAuthJSON = function() {
  return {
    _id: this._id,
    cnpj: this.cnpj,
    email: this.email,
    token: this.generateJWT(),
    roles: this.roles,
    name: this.name,
  };
};

UserSchema.virtual('collectors_group', {
  ref: 'CollectorsGroup',
  localField: '_id',
  foreignField: 'collectors',
  justOne: true
});

UserSchema.virtual('collections', {
  ref: 'Collection',
  localField: '_id',
  foreignField: 'collector'
});

UserSchema.virtual('collection_areas', {
  ref: 'CollectionArea',
  localField: '_id',
  foreignField: 'collector'
});

UserSchema.virtual('collectors_requests', {
  ref: 'CollectorsRequest',
  localField: '_id',
  foreignField: 'collector'
});

UserSchema.virtual('orders', {
  ref: 'Order',
  localField: '_id',
  foreignField: 'client'
});

UserSchema.virtual('potential_lists', {
  ref: 'PotentialList',
  localField: '_id',
  foreignField: 'collector'
});

UserSchema.virtual('seeds_matrixes', {
  ref: 'SeedsMatrix',
  localField: '_id',
  foreignField: 'collector'
});

UserSchema.virtual('stock_ins', {
  ref: 'StockIn',
  localField: '_id',
  foreignField: 'collector'
});

UserSchema.virtual('stock_outs', {
  ref: 'StockOut',
  localField: '_id',
  foreignField: 'buyer'
});

UserSchema.virtual('seeds_houses', {
  ref: 'SeedsHouse',
  localField: '_id',
  foreignField: 'owner'
});

UserSchema.virtual('seeds_houses_collector', {
  ref: 'SeedsHouse',
  localField: '_id',
  foreignField: 'collectors'
});

mongoose.model('User', UserSchema);
