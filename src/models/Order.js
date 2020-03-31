const mongoose = require('mongoose'),
  ObjectId = mongoose.Schema.Types.ObjectId,
  AddressSchema = require('./Address'),
  OrderItemSchema = require('./OrderItem');

const OrderSchema = mongoose.Schema({
  code: {
    type: Number,
    required: true
  },
  client: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  status: String,
  items: [OrderItemSchema],
  name: String,
  cnpj: String,
  email: String,
  phone: String,
  address: AddressSchema
}, {
  timestamps: true,
});

mongoose.model('Order', OrderSchema);
