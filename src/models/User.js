var mongoose = require('mongoose'),
  uniqueValidator = require('mongoose-unique-validator'),
  crypto = require('crypto'),
  jwt = require('jsonwebtoken'),
  secret = require('../config').secret,
  ObjectId = mongoose.Schema.Types.ObjectId;
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
  phone: String,
  address: String,
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
    name: this.name,
    phone: this.phone,
    email: this.email,
    address: this.address,
    organization: this.organization,
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
    phone: this.phone,
    address: this.address,
  };
};

mongoose.model('User', UserSchema);
