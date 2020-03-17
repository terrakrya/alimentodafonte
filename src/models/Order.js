const mongoose = require('mongoose'),
  ObjectId = mongoose.Schema.Types.ObjectId,
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
  address: String
}, {
  timestamps: true,
});

mongoose.model('Order', OrderSchema);
