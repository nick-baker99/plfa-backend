const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
  chatroom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chatroom',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  message: {
    type: String,
    required: true
  },
  createdAt: Date
});

const Message = mongoose.model('message', messageSchema);

module.exports = Message;