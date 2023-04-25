const mongoose = require('mongoose');

// define schema for company services
const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  icon: {
    prefix: {
      type: String,
      default: 'fa'
    },
    name: {
      type: String,
      default: 'futbol'
    }
  },
  description: {
    type: String,
    default: ''
  },
  link: {
    type: String,
    default: ''
  }
});

const Service = mongoose.model('service', serviceSchema);

module.exports = Service;