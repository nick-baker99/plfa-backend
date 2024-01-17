const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
  chatroomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chatroom',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: new Date()
  }
});

const Message = mongoose.model('message', messageSchema);

module.exports = Message;