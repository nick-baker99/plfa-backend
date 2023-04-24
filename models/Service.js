const mongoose = require('mongoose');

// define schema for company services
const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: 'IoFootball'
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