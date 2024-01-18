const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: String,
  displayName: String,
  password: {
    type: String,
    required: true
  },
  country: {
    type: Number,
    required: true
  },
  teamID: {
    type: Number,
    default: 0
  },
  roles: {
    User: {
      type: Number,
      default: 1337,
    },
    Moderator: Number,
    Admin: Number
  },
  favouriteChatrooms: {
    type: Array,
    default: ["65a6f051c694897c9a9dbb95"]
  },
  refreshToken: {
    type: String,
    default: ""
  },
  createdAt: {
    type: Date,
    default: new Date()
  }
});

const User = mongoose.model('user', userSchema);

module.exports = User;