const mongoose = require('mongoose'),
  ObjectId = mongoose.Schema.Types.ObjectId;

const OrderItemSchema = mongoose.Schema({
  order: {
    type: ObjectId,
    ref: 'Order',
    required: true
  },
  offer: {
    type: ObjectId,
    ref: 'Offer',
    required: true
  },
  qtd: Number,
  price: Number,
  total: Number,
}, {
  timestamps: true,
});

mongoose.model('OrderItem', OrderItemSchema);
