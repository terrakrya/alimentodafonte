const mongoose = require('mongoose'),
  ObjectId = mongoose.Schema.Types.ObjectId,
  Mixed = mongoose.Schema.Types.Mixed;

const MessageSchema = mongoose.Schema({
  room: {
    type: String,
    index: true
  },
  type: String,
  content: Mixed,
  userId: ObjectId,
}, {
  timestamps: true,
});

mongoose.model('Message', MessageSchema);
