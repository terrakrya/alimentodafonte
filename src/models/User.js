var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var secret = require('../config').secret;
var AddressSchema = require('./Address');
var BankAccountSchema = require('./BankAccount');
var CollectorsGroupSchema = require('./CollectorsGroup').schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

var UserSchema = new mongoose.Schema({
  username: {
    type: String,
    lowercase: true,
    unique: true,
    required: [true, "é obrigatório"],
    match: [/^[a-zA-Z0-9]+$/, 'inválido'],
    index: true
  },
  email: {
    type: String,
    lowercase: true,
    unique: true,
    match: [/\S+@\S+\.\S+/, 'inválido'],
    index: true
  },
  hash: String,
  salt: String,
  name: String,
  nickname: String,
  cpf: String,
  contact: String,
  roles: [String],
  image: Object,
  address: AddressSchema,
  bank_account: BankAccountSchema,
  // collectors_group: [{ type: ObjectId, ref: 'CollectorsGroup' }]
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
    username: this.username,
    roles: this.roles,
    exp: parseInt(exp.getTime() / 1000),
  }, secret);
};

UserSchema.methods.toAuthJSON = function() {
  return {
    _id: this._id,
    username: this.username,
    email: this.email,
    token: this.generateJWT(),
    roles: this.roles,
    name: this.name,
    image: this.image
  };
};

UserSchema.virtual('collectors_group', {
  ref: 'CollectorsGroup',
  localField: '_id',
  foreignField: 'collectors',
  justOne: true
});

mongoose.model('User', UserSchema);
