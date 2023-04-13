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
      default: 1337
    },
    Moderator: {
      type: Number,
      default: 1964
    },
    Admin: {
      type: Number,
      default: 1999
    }
  },
  refreshToken: String
});

const User = mongoose.model('user', userSchema);

module.exports = User;