const mongoose = require('mongoose');

const chatroomSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  image: String,
  active: {
    type: Boolean,
    default: false
  }
});

const Chatroom = mongoose.model('chatroom', chatroomSchema);

module.exports = Chatroom;