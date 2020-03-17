const mongoose = require('mongoose'),
  ObjectId = mongoose.Schema.Types.ObjectId;

const OrderSchema = mongoose.Schema({
  client: {
    type: ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,
});

OrderSchema.virtual('items', {
  ref: 'OrderItem',
  localField: '_id',
  foreignField: 'order'
});


mongoose.model('Order', OrderSchema);
